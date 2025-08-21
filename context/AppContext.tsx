import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { User, UserRole, IssueReport, Comment, Report, ReactionType } from '../types';
import * as api from '../services/api';

interface AppContextType {
    authenticatedUser: User | null;
    users: User[];
    issueReports: IssueReport[];
    allTags: string[];
    login: (email: string, password: string) => Promise<User | null>;
    logout: () => void;
    addReport: (report: Omit<IssueReport, 'id' | 'timestamp' | 'reactions' | 'comments' | 'reports' | 'status' | 'authorId'>) => Promise<void>;
    addComment: (reportId: string, comment: Omit<Comment, 'id' | 'timestamp' | 'reports' | 'authorId' | 'reactions'>) => Promise<void>;
    toggleReaction: (reportId: string, reactionType: ReactionType) => Promise<void>;
    toggleCommentReaction: (reportId: string, commentId: string, reactionType: ReactionType) => Promise<void>;
    reportIssue: (reportId: string, report: Omit<Report, 'timestamp' | 'reporterId'>) => Promise<void>;
    reportComment: (reportId: string, commentId: string, report: Omit<Report, 'timestamp' | 'reporterId'>) => Promise<void>;
    assignIssue: (reportId: string) => Promise<void>;
    resolveIssue: (reportId: string, resolutionNote: string) => Promise<void>;
    toggleFollow: (targetUserId: string) => Promise<void>;
    updateUserRole: (userId: string, newRole: UserRole) => Promise<void>;
    blockUser: (userId: string) => Promise<void>;
    getUserById: (userId: string) => User | undefined;
    updateUserProfile: (profileData: Partial<User>) => Promise<void>;
    regenerateApiKey: () => Promise<void>;
    addTag: (tag: string) => Promise<void>;
    removeTag: (tag: string) => Promise<void>;
    updateUserTheme: (theme: 'light' | 'dark') => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [issueReports, setIssueReports] = useState<IssueReport[]>([]);
    const [allTags, setAllTags] = useState<string[]>([]);

    const refreshAllData = useCallback(async () => {
        try {
            const [fetchedUsers, fetchedReports, fetchedTags] = await Promise.all([
                api.getUsers(),
                api.getIssueReports(),
                api.getAllTags()
            ]);
            setUsers(fetchedUsers);
            setIssueReports(fetchedReports);
            setAllTags(fetchedTags);
        } catch (error) {
            console.error("Failed to refresh data:", error);
        }
    }, []);

    useEffect(() => {
        // Initial data load on startup if user data is not present
        if (!authenticatedUser) {
            refreshAllData();
        }
    }, [authenticatedUser, refreshAllData]);

    useEffect(() => {
        if (authenticatedUser && users.length > 0) {
            const latestUserData = users.find(u => u.id === authenticatedUser.id);
            if (!latestUserData || latestUserData.isBlocked) {
                setAuthenticatedUser(null);
            } else if (JSON.stringify(latestUserData) !== JSON.stringify(authenticatedUser)) {
                setAuthenticatedUser(latestUserData);
            }
        }
    }, [users, authenticatedUser]);


    const login = async (email: string, password: string): Promise<User | null> => {
        const user = await api.authenticate(email, password);
        if (user) {
            setAuthenticatedUser(user);
            await refreshAllData(); 
        }
        return user;
    };

    const logout = () => {
        setAuthenticatedUser(null);
        setUsers([]);
        setIssueReports([]);
        setAllTags([]);
    };
    
    const withAuthAndRefresh = <T extends any[]>(action: (user: User, ...args: T) => Promise<any>) => {
        return async (...args: T) => {
            if (!authenticatedUser) throw new Error("User not authenticated");
            await action(authenticatedUser, ...args);
            await refreshAllData();
        };
    };

    const getUserById = useCallback((userId: string): User | undefined => {
        return users.find(u => u.id === userId);
    }, [users]);
    
    const updateUserTheme = async (theme: 'light' | 'dark') => {
        if (!authenticatedUser) return;
        try {
            await api.updateUserTheme(authenticatedUser.id, theme);
            // Directly update the authenticated user state to avoid full refresh and logout bug
            setAuthenticatedUser(prevUser => prevUser ? { ...prevUser, theme } : null);
            // Also update the master users list to keep it in sync
            setUsers(prevUsers => prevUsers.map(u => u.id === authenticatedUser.id ? { ...u, theme } : u));
        } catch (error) {
            console.error("Failed to update theme:", error);
        }
    };

    const addReport = withAuthAndRefresh(async (user, reportData) => api.submitReport(user.id, reportData));
    const addComment = withAuthAndRefresh(async (user, reportId, commentData) => api.addComment(user.id, reportId, commentData));
    const toggleReaction = withAuthAndRefresh(async (user, reportId, reactionType) => api.toggleReaction(user.id, reportId, reactionType));
    const toggleCommentReaction = withAuthAndRefresh(async (user, reportId, commentId, reactionType) => api.toggleCommentReaction(user.id, reportId, commentId, reactionType));
    const reportIssue = withAuthAndRefresh(async (user, reportId, reportData) => api.reportIssue(user.id, reportId, reportData));
    const reportComment = withAuthAndRefresh(async (user, reportId, commentId, reportData) => api.reportComment(user.id, reportId, commentId, reportData));
    const assignIssue = withAuthAndRefresh(async (user, reportId) => api.assignIssue(user.id, reportId));
    const resolveIssue = withAuthAndRefresh(async (user, reportId, resolutionNote) => api.resolveIssue(user.id, reportId, resolutionNote));
    const toggleFollow = withAuthAndRefresh(async (user, targetUserId) => api.toggleFollow(user.id, targetUserId));
    const updateUserRole = withAuthAndRefresh(async (user, userId, newRole) => api.updateUserRole(user.id, userId, newRole));
    const blockUser = withAuthAndRefresh(async (user, userId) => api.blockUser(user.id, userId));
    const updateUserProfile = withAuthAndRefresh(async (user, profileData) => api.updateUserProfile(user.id, profileData));
    const regenerateApiKey = withAuthAndRefresh(async (user) => api.regenerateApiKey(user.id));
    const addTag = withAuthAndRefresh(async (user, tag) => api.addTag(user.id, tag));
    const removeTag = withAuthAndRefresh(async (user, tag) => api.removeTag(user.id, tag));

    return (
        <AppContext.Provider value={{
            authenticatedUser,
            users,
            issueReports,
            allTags,
            login,
            logout,
            addReport,
            addComment,
            toggleReaction,
            toggleCommentReaction,
            reportIssue,
            reportComment,
            assignIssue,
            resolveIssue,
            toggleFollow,
            updateUserRole,
            blockUser,
            getUserById,
            updateUserProfile,
            regenerateApiKey,
            addTag,
            removeTag,
            updateUserTheme,
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
