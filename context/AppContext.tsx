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
    addComment: (reportId: string, comment: Omit<Comment, 'id' | 'timestamp' | 'reports' | 'authorId'>) => Promise<void>;
    toggleReaction: (reportId: string, reactionType: ReactionType) => Promise<void>;
    reportIssue: (reportId: string, report: Omit<Report, 'timestamp' | 'reporterId'>) => Promise<void>;
    reportComment: (reportId: string, commentId: string, report: Omit<Report, 'timestamp' | 'reporterId'>) => Promise<void>;
    resolveIssue: (reportId: string, resolutionNote: string) => Promise<void>;
    toggleFollow: (targetUserId: string) => Promise<void>;
    updateUserRole: (userId: string, newRole: UserRole) => Promise<void>;
    blockUser: (userId: string) => Promise<void>;
    getUserById: (userId: string) => User | undefined;
    updateUserProfile: (profileData: Partial<User>) => Promise<void>;
    regenerateApiKey: () => Promise<void>;
    addTag: (tag: string) => Promise<void>;
    removeTag: (tag: string) => Promise<void>;
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

    // This effect keeps the authenticatedUser object up-to-date with the master users list.
    // This is useful after an action (like follow/unfollow) updates the user's data.
    useEffect(() => {
        if (authenticatedUser && users.length > 0) {
            const latestUserData = users.find(u => u.id === authenticatedUser.id);
            if (!latestUserData || latestUserData.isBlocked) {
                // User was deleted or blocked, log them out.
                setAuthenticatedUser(null);
            } else if (JSON.stringify(latestUserData) !== JSON.stringify(authenticatedUser)) {
                // User data has changed, update the authenticatedUser object.
                // This will not cause a loop because it only runs when `users` array changes,
                // and it only sets state if the user data is actually different.
                setAuthenticatedUser(latestUserData);
            }
        }
    }, [users, authenticatedUser]);


    const login = async (email: string, password: string): Promise<User | null> => {
        const user = await api.authenticate(email, password);
        if (user) {
            setAuthenticatedUser(user);
            await refreshAllData(); // Load all data after successful login
        }
        return user;
    };

    const logout = () => {
        setAuthenticatedUser(null);
        // Clear data to prevent stale data flashing on next login
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

    const addReport = withAuthAndRefresh(async (user, reportData) => api.submitReport(user.id, reportData));
    const addComment = withAuthAndRefresh(async (user, reportId, commentData) => api.addComment(user.id, reportId, commentData));
    const toggleReaction = withAuthAndRefresh(async (user, reportId, reactionType) => api.toggleReaction(user.id, reportId, reactionType));
    const reportIssue = withAuthAndRefresh(async (user, reportId, reportData) => api.reportIssue(user.id, reportId, reportData));
    const reportComment = withAuthAndRefresh(async (user, reportId, commentId, reportData) => api.reportComment(user.id, reportId, commentId, reportData));
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
            reportIssue,
            reportComment,
            resolveIssue,
            toggleFollow,
            updateUserRole,
            blockUser,
            getUserById,
            updateUserProfile,
            regenerateApiKey,
            addTag,
            removeTag,
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