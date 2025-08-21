export enum UserRole {
    USER = 'User',
    RESOLVER = 'Resolver',
    ADMIN = 'Admin',
}

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string; // Should not be sent to client in a real app
    avatarUrl: string;
    role: UserRole;
    apiKey: string;
    age?: number;
    followers: string[]; // Array of user IDs
    following: string[]; // Array of user IDs
    isBlocked?: boolean;
}

export enum ReactionType {
    LIKE = '👍',
    DISLIKE = '👎',
    LAUGH = '😂',
    SAD = '😢',
    LOVE = '❤️'
}

export interface Reaction {
    userId: string;
    type: ReactionType;
}

export interface Report {
    reporterId: string;
    isAnonymous: boolean;
    reason: string;
    timestamp: Date;
}

export interface Comment {
    id: string;
    authorId: string;
    text: string;
    timestamp: Date;
    reports: Report[];
}

export enum IssueStatus {
    ACTIVE = 'Active',
    UNDER_REVIEW = 'Under Review',
    RESOLVED = 'Resolved'
}

export interface IssueReport {
    id: string;
    authorId: string;
    isAnonymous: boolean;
    text?: string;
    mediaUrl?: string;

    tags: string[];
    mentions: string[];
    
    reactions: Reaction[];
    comments: Comment[];
    reports: Report[];
    
    timestamp: Date;
    status: IssueStatus;
    resolutionNote?: string;
    isFromBlockedUser?: boolean;
    blockId?: string;
}