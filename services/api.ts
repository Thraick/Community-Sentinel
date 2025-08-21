import { User, IssueReport, UserRole, ReactionType, IssueStatus, Comment, Report } from '../types';
import { ALL_USERS, INITIAL_REPORTS } from '../constants';

// --- LocalStorage Database ---
const DB_KEY_USERS = 'community_sentinel_users';
const DB_KEY_REPORTS = 'community_sentinel_reports';
const DB_KEY_TAGS = 'community_sentinel_tags';

const loadFromStorage = <T>(key: string, fallback: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        if (item) {
            return JSON.parse(item);
        }
        window.localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return fallback;
    }
};

const saveToStorage = <T>(key: string, data: T) => {
    try {
        window.localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
};

// --- In-memory Store, loaded from LocalStorage ---
let users: User[] = loadFromStorage<User[]>(DB_KEY_USERS, JSON.parse(JSON.stringify(ALL_USERS)));
let allTags: string[] = loadFromStorage<string[]>(DB_KEY_TAGS, ['#pothole', '#safety', '#parking', '#traffic', '#infrastructure', '#community', '#illegal-dumping', '#street-light', '#hazard', '#pedestrian', '#vandalism', '#sanitation']);

const reviveReportDates = (report: any): IssueReport => ({
    ...report,
    timestamp: new Date(report.timestamp),
    comments: report.comments.map((c: any) => ({ ...c, timestamp: new Date(c.timestamp) })),
    reports: report.reports.map((r: any) => ({ ...r, timestamp: new Date(r.timestamp) })),
});
let issueReports: IssueReport[] = loadFromStorage<any[]>(DB_KEY_REPORTS, INITIAL_REPORTS).map(reviveReportDates);

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

const checkAdmin = (adminId: string) => {
    const admin = users.find(u => u.id === adminId);
    if (!admin || admin.role !== UserRole.ADMIN) {
        throw new Error("Admin privileges required.");
    }
};

const checkResolverOrAdmin = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.RESOLVER)) {
        throw new Error("Resolver or Admin privileges required.");
    }
};


// --- API Functions ---

export const authenticate = async (email: string, password: string): Promise<User | null> => {
    await simulateDelay(500);
    const user = users.find(u => u.email === email && u.password === password && !u.isBlocked);
    if (user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
};

export const getUsers = async (): Promise<User[]> => {
    await simulateDelay(100);
    return users.map(({ password, ...user }) => user);
};

export const getIssueReports = async (): Promise<IssueReport[]> => {
    await simulateDelay(100);
    return [...issueReports].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const getAllTags = async (): Promise<string[]> => {
    await simulateDelay(50);
    return [...allTags].sort();
}

export const submitReport = async (authorId: string, reportData: Omit<IssueReport, 'id' | 'timestamp' | 'reactions' | 'comments' | 'reports' | 'status' | 'authorId'>): Promise<IssueReport> => {
    await simulateDelay(300);
    const newReport: IssueReport = {
        id: `report-${Date.now()}`,
        authorId,
        timestamp: new Date(),
        reactions: [],
        comments: [],
        reports: [],
        status: IssueStatus.ACTIVE,
        ...reportData,
    };
    issueReports = [newReport, ...issueReports];
    saveToStorage(DB_KEY_REPORTS, issueReports);
    return newReport;
};

export const addComment = async (authorId: string, reportId: string, commentData: Omit<Comment, 'id' | 'timestamp' | 'reports' | 'authorId' | 'reactions'>): Promise<Comment> => {
    await simulateDelay(200);
    const newComment: Comment = {
        id: `comment-${Date.now()}`,
        authorId,
        timestamp: new Date(),
        reports: [],
        reactions: [],
        ...commentData
    };
    issueReports = issueReports.map(r => r.id === reportId ? { ...r, comments: [...r.comments, newComment] } : r);
    saveToStorage(DB_KEY_REPORTS, issueReports);
    return newComment;
};

export const toggleReaction = async (userId: string, reportId: string, reactionType: ReactionType): Promise<void> => {
    await simulateDelay(100);
    issueReports = issueReports.map(r => {
        if (r.id === reportId) {
            const existingIndex = r.reactions.findIndex(reaction => reaction.userId === userId);
            if (existingIndex > -1) {
                if (r.reactions[existingIndex].type === reactionType) {
                    return { ...r, reactions: r.reactions.filter(reaction => reaction.userId !== userId) };
                } else {
                    const updatedReactions = [...r.reactions];
                    updatedReactions[existingIndex].type = reactionType;
                    return { ...r, reactions: updatedReactions };
                }
            } else {
                return { ...r, reactions: [...r.reactions, { userId, type: reactionType }] };
            }
        }
        return r;
    });
    saveToStorage(DB_KEY_REPORTS, issueReports);
};

export const toggleCommentReaction = async (userId: string, reportId: string, commentId: string, reactionType: ReactionType): Promise<void> => {
    await simulateDelay(100);
    issueReports = issueReports.map(r => {
        if (r.id === reportId) {
            r.comments = r.comments.map(c => {
                if (c.id === commentId) {
                    const existingIndex = c.reactions.findIndex(reaction => reaction.userId === userId);
                    if (existingIndex > -1) {
                        if (c.reactions[existingIndex].type === reactionType) {
                            c.reactions = c.reactions.filter(reaction => reaction.userId !== userId);
                        } else {
                            c.reactions[existingIndex].type = reactionType;
                        }
                    } else {
                        c.reactions.push({ userId, type: reactionType });
                    }
                }
                return c;
            })
        }
        return r;
    });
    saveToStorage(DB_KEY_REPORTS, issueReports);
};

export const reportIssue = async (reporterId: string, reportId: string, reportData: Omit<Report, 'timestamp' | 'reporterId'>): Promise<void> => {
    await simulateDelay(200);
    const newReport: Report = { ...reportData, reporterId, timestamp: new Date() };
    issueReports = issueReports.map(r => {
        if (r.id === reportId) {
            return { ...r, reports: [...r.reports, newReport], status: IssueStatus.UNDER_REVIEW };
        }
        return r;
    });
    saveToStorage(DB_KEY_REPORTS, issueReports);
};

export const reportComment = async (reporterId: string, reportId: string, commentId: string, reportData: Omit<Report, 'timestamp' | 'reporterId'>): Promise<void> => {
    await simulateDelay(200);
    const newReport: Report = { ...reportData, reporterId, timestamp: new Date() };
    issueReports = issueReports.map(r => {
        if (r.id === reportId) {
            r.comments = r.comments.map(c => c.id === commentId ? { ...c, reports: [...c.reports, newReport] } : c);
        }
        return r;
    });
    saveToStorage(DB_KEY_REPORTS, issueReports);
};

export const assignIssue = async (resolverId: string, reportId: string): Promise<void> => {
    await simulateDelay(300);
    checkResolverOrAdmin(resolverId);
    issueReports = issueReports.map(r => r.id === reportId ? { ...r, status: IssueStatus.IN_PROGRESS, resolverId } : r);
    saveToStorage(DB_KEY_REPORTS, issueReports);
};

export const resolveIssue = async (resolverId: string, reportId: string, resolutionNote: string): Promise<void> => {
    await simulateDelay(300);
    checkResolverOrAdmin(resolverId);
    issueReports = issueReports.map(r => r.id === reportId ? { ...r, status: IssueStatus.RESOLVED, resolutionNote, resolverId } : r);
    saveToStorage(DB_KEY_REPORTS, issueReports);
};

export const toggleFollow = async (currentUserId: string, targetUserId: string): Promise<void> => {
    await simulateDelay(150);
    users = users.map(u => {
        if (u.id === currentUserId) {
            const isFollowing = u.following.includes(targetUserId);
            return { ...u, following: isFollowing ? u.following.filter(id => id !== targetUserId) : [...u.following, targetUserId] };
        }
        if (u.id === targetUserId) {
            const hasFollower = u.followers.includes(currentUserId);
            return { ...u, followers: hasFollower ? u.followers.filter(id => id !== currentUserId) : [...u.followers, currentUserId] };
        }
        return u;
    });
    saveToStorage(DB_KEY_USERS, users);
};

export const updateUserRole = async (adminId: string, userId: string, newRole: UserRole): Promise<void> => {
    await simulateDelay(200);
    checkAdmin(adminId);
    users = users.map(u => u.id === userId ? { ...u, role: newRole } : u);
    saveToStorage(DB_KEY_USERS, users);
};

export const blockUser = async (adminId: string, userIdToBlock: string): Promise<void> => {
    await simulateDelay(500);
    checkAdmin(adminId);
    const userToBlock = users.find(u => u.id === userIdToBlock);
    if (!userToBlock || userToBlock.role === UserRole.ADMIN) {
        throw new Error("Cannot block this user.");
    }

    const blockId = `block-${Date.now()}`;
    users = users.map(u => u.id === userIdToBlock ? { ...u, isBlocked: true } : u);
    saveToStorage(DB_KEY_USERS, users);

    issueReports = issueReports.map(report => {
        if (report.authorId === userIdToBlock) {
            report.isFromBlockedUser = true;
            report.blockId = blockId;
            report.text = `[Content from blocked user #${blockId}]`;
            report.mediaUrl = undefined;
            report.isAnonymous = true;
        }
        report.comments = report.comments.map(comment => {
            if (comment.authorId === userIdToBlock) {
                return { ...comment, text: `[Comment from blocked user #${blockId}]` };
            }
            return comment;
        });
        report.reactions = report.reactions.filter(r => r.userId !== userIdToBlock);
        return report;
    });
    saveToStorage(DB_KEY_REPORTS, issueReports);
};

export const updateUserProfile = async (userId: string, profileData: Partial<User>): Promise<void> => {
    await simulateDelay(300);
    users = users.map(u => u.id === userId ? { ...u, ...profileData } : u);
    saveToStorage(DB_KEY_USERS, users);
};

export const regenerateApiKey = async (userId: string): Promise<void> => {
    await simulateDelay(200);
    const newKey = `u${userId.split('-')[1]}-${crypto.randomUUID()}`;
    users = users.map(u => u.id === userId ? { ...u, apiKey: newKey } : u);
    saveToStorage(DB_KEY_USERS, users);
}

export const addTag = async (adminId: string, tag: string): Promise<void> => {
    await simulateDelay(100);
    checkAdmin(adminId);
    const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
    if (!allTags.includes(formattedTag)) {
        allTags.push(formattedTag);
        saveToStorage(DB_KEY_TAGS, allTags);
    }
}

export const removeTag = async (adminId: string, tag: string): Promise<void> => {
    await simulateDelay(100);
    checkAdmin(adminId);
    allTags = allTags.filter(t => t !== tag);
    saveToStorage(DB_KEY_TAGS, allTags);
}

export const updateUserTheme = async (userId: string, theme: 'light' | 'dark'): Promise<void> => {
    await simulateDelay(100);
    users = users.map(u => u.id === userId ? { ...u, theme } : u);
    saveToStorage(DB_KEY_USERS, users);
};
