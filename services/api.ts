import { User, IssueReport, UserRole, ReactionType, IssueStatus, Comment, Report } from '../types';
import { ALL_USERS } from '../constants';

// --- In-memory Database ---
let users: User[] = JSON.parse(JSON.stringify(ALL_USERS));

let allTags: string[] = ['#pothole', '#safety', '#parking', '#traffic', '#infrastructure', '#community', '#illegal-dumping', '#street-light', '#hazard'];

let issueReports: IssueReport[] = [
    {
        id: 'report-1', authorId: 'user-2', isAnonymous: false,
        text: 'There is a massive pothole on Elm Street right before the elementary school. It\'s a serious hazard for cars and cyclists. I almost lost control of my bike this morning!',
        mediaUrl: 'https://picsum.photos/seed/pothole/800/600',
        tags: ['#pothole', '#safety', '#infrastructure'], mentions: [],
        reactions: [
            { userId: 'user-1', type: ReactionType.LIKE }, 
            { userId: 'user-3', type: ReactionType.LIKE },
            { userId: 'user-4', type: ReactionType.LIKE }
        ],
        comments: [
            { id: 'comment-1-1', authorId: 'user-3', text: 'I hit that yesterday! The city needs to fix this ASAP.', timestamp: new Date(Date.now() - 3600000 * 2), reports: [] },
            { id: 'comment-1-2', authorId: 'user-1', text: 'Thanks for reporting. I\'ve sent a complaint to the public works department.', timestamp: new Date(Date.now() - 3600000 * 1), reports: [] },
        ],
        reports: [], timestamp: new Date(Date.now() - 3600000 * 3), status: IssueStatus.ACTIVE,
    },
    {
        id: 'report-2', authorId: 'user-3', isAnonymous: true,
        text: 'A blue sedan has been parked in front of a fire hydrant on Main Street for three days now. License plate is ABC-123.',
        tags: ['#parking', '#safety', '#hazard'], mentions: [],
        reactions: [{ userId: 'user-1', type: ReactionType.LIKE }], 
        comments: [],
        reports: [{ reporterId: 'user-2', isAnonymous: false, reason: 'This issue is critical and needs immediate attention.', timestamp: new Date(Date.now() - 3600000 * 5) }],
        timestamp: new Date(Date.now() - 3600000 * 6), status: IssueStatus.UNDER_REVIEW,
    },
     {
        id: 'report-3', authorId: 'user-1', isAnonymous: false,
        text: 'Someone has been illegally dumping trash and old furniture behind the community park. It\'s becoming an eyesore and a health hazard.',
        mediaUrl: 'https://picsum.photos/seed/dumping/800/600',
        tags: ['#illegal-dumping', '#community', '#hazard'], mentions: [], 
        reactions: [{ userId: 'user-2', type: ReactionType.SAD }, { userId: 'user-3', type: ReactionType.DISLIKE }], 
        comments: [
             { id: 'comment-3-1', authorId: 'user-3', text: 'This is awful. I hope they get caught.', timestamp: new Date(Date.now() - 3600000 * 20), reports: [] },
        ],
        reports: [],
        timestamp: new Date(Date.now() - 3600000 * 22), status: IssueStatus.ACTIVE,
    },
     {
        id: 'report-4', authorId: 'user-4', isAnonymous: false,
        text: 'The street light at the corner of Oak & Pine has been out for over a week. It\'s very dark and feels unsafe at night.',
        tags: ['#street-light', '#safety'], mentions: [], 
        reactions: [], 
        comments: [],
        reports: [],
        timestamp: new Date(Date.now() - 3600000 * 26), status: IssueStatus.RESOLVED,
        resolutionNote: 'A work order was created with the city electrical department. They have confirmed the light has been repaired as of this morning. Ticket #8432.'
    },
];

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

const checkAdmin = (adminId: string) => {
    const admin = users.find(u => u.id === adminId);
    if (!admin || admin.role !== UserRole.ADMIN) {
        throw new Error("Admin privileges required.");
    }
};


// --- API Functions ---

export const authenticate = async (email: string, password: string): Promise<User | null> => {
    await simulateDelay(500);
    const user = users.find(u => u.email === email && u.password === password && !u.isBlocked);
    if (user) {
        // In a real app, never send the password back
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
};

export const getUsers = async (): Promise<User[]> => {
    await simulateDelay(100);
    return users.map(({ password, ...user }) => user); // Don't expose passwords
};

export const getIssueReports = async (): Promise<IssueReport[]> => {
    await simulateDelay(100);
    return [...issueReports].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
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
    return newReport;
};

export const addComment = async (authorId: string, reportId: string, commentData: Omit<Comment, 'id' | 'timestamp' | 'reports' | 'authorId'>): Promise<Comment> => {
    await simulateDelay(200);
    const newComment: Comment = {
        id: `comment-${Date.now()}`,
        authorId,
        timestamp: new Date(),
        reports: [],
        ...commentData
    };
    issueReports = issueReports.map(r => r.id === reportId ? { ...r, comments: [newComment, ...r.comments] } : r);
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
};

export const reportComment = async (reporterId: string, reportId: string, commentId: string, reportData: Omit<Report, 'timestamp' | 'reporterId'>): Promise<void> => {
    await simulateDelay(200);
    const newReport: Report = { ...reportData, reporterId, timestamp: new Date() };
    issueReports = issueReports.map(r => {
        if (r.id === reportId) {
            return {
                ...r,
                comments: r.comments.map(c => c.id === commentId ? { ...c, reports: [...c.reports, newReport] } : c)
            };
        }
        return r;
    });
};

export const resolveIssue = async (resolverId: string, reportId: string, resolutionNote: string): Promise<void> => {
    await simulateDelay(300);
    const resolver = users.find(u => u.id === resolverId);
    if (!resolver || (resolver.role !== UserRole.ADMIN && resolver.role !== UserRole.RESOLVER)) {
        throw new Error("Unauthorized to resolve issues");
    }
    issueReports = issueReports.map(r => r.id === reportId ? { ...r, status: IssueStatus.RESOLVED, resolutionNote } : r);
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
};

export const updateUserRole = async (adminId: string, userId: string, newRole: UserRole): Promise<void> => {
    await simulateDelay(200);
    checkAdmin(adminId);
    users = users.map(u => u.id === userId ? { ...u, role: newRole } : u);
};

export const blockUser = async (adminId: string, userIdToBlock: string): Promise<void> => {
    await simulateDelay(500);
    checkAdmin(adminId);
    const userToBlock = users.find(u => u.id === userIdToBlock);
    if (!userToBlock || userToBlock.role === UserRole.ADMIN) {
        throw new Error("Cannot block this user.");
    }

    const blockId = `block-${Date.now()}`;
    // Mark user as blocked
    users = users.map(u => u.id === userIdToBlock ? { ...u, isBlocked: true } : u);

    // Anonymize user's content
    issueReports = issueReports.map(report => {
        let updatedReport = { ...report };
        if (report.authorId === userIdToBlock) {
            updatedReport.isFromBlockedUser = true;
            updatedReport.blockId = blockId;
            updatedReport.text = `[Content from blocked user #${blockId}]`;
            updatedReport.mediaUrl = undefined;
            updatedReport.isAnonymous = true;
        }
        updatedReport.comments = report.comments.map(comment => {
            if (comment.authorId === userIdToBlock) {
                return { ...comment, text: `[Comment from blocked user #${blockId}]` };
            }
            return comment;
        });
        updatedReport.reactions = report.reactions.filter(r => r.userId !== userIdToBlock);
        return updatedReport;
    });
};

export const updateUserProfile = async (userId: string, profileData: Partial<User>): Promise<void> => {
    await simulateDelay(300);
    users = users.map(u => u.id === userId ? { ...u, ...profileData } : u);
};

export const regenerateApiKey = async (userId: string): Promise<void> => {
    await simulateDelay(200);
    const newKey = `u${userId.split('-')[1]}-${crypto.randomUUID()}`;
    users = users.map(u => u.id === userId ? { ...u, apiKey: newKey } : u);
}

export const addTag = async (adminId: string, tag: string): Promise<void> => {
    await simulateDelay(100);
    checkAdmin(adminId);
    const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
    if (!allTags.includes(formattedTag)) {
        allTags.push(formattedTag);
    }
}

export const removeTag = async (adminId: string, tag: string): Promise<void> => {
    await simulateDelay(100);
    checkAdmin(adminId);
    allTags = allTags.filter(t => t !== tag);
}