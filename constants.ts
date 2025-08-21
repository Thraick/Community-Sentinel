import { User, UserRole } from './types';

// In a real app, this data would come from a database.
// Passwords are included for the mock login system. DO NOT do this in production.
export const ALL_USERS: User[] = [
    { 
        id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com', password: 'password', 
        avatarUrl: 'https://picsum.photos/seed/alice/100/100', role: UserRole.USER,
        apiKey: 'u1-a7b3c9f2-e8d1-4f6a-b2c5-3d1e7f0a9b4c', age: 28,
        followers: ['user-2'],
        following: ['user-2', 'user-3']
    },
    { 
        id: 'user-2', name: 'Bob Williams', email: 'bob@example.com', password: 'password',
        avatarUrl: 'https://picsum.photos/seed/bob/100/100', role: UserRole.USER,
        apiKey: 'u2-b8c4d0g3-f9e2-5g7b-c3d6-4e2f8g1b0c5d', age: 34,
        followers: ['user-1', 'user-3'],
        following: ['user-1']
    },
    { 
        id: 'user-3', name: 'Charlie Brown', email: 'charlie@example.com', password: 'password',
        avatarUrl: 'https://picsum.photos/seed/charlie/100/100', role: UserRole.USER,
        apiKey: 'u3-c9d5e1h4-g0f3-6h8c-d4e7-5f3g9h2c1d6e', age: 45,
        followers: ['user-1'],
        following: ['user-2']
    },
    { 
        id: 'user-4', name: 'Diana Prince', email: 'diana@example.com', password: 'password',
        avatarUrl: 'https://picsum.photos/seed/diana/100/100', role: UserRole.RESOLVER,
        apiKey: 'u4-d0e6f2i5-h1g4-7i9d-e5f8-6g4h0i3d2e7f', age: 31,
        followers: [],
        following: []
    },
    { 
        id: 'user-5', name: 'Ethan Hunt', email: 'admin@example.com', password: 'admin',
        avatarUrl: 'https://picsum.photos/seed/ethan/100/100', role: UserRole.ADMIN,
        apiKey: 'u5-e1f7g3j6-i2h5-8j0e-f6g9-7h5i1j4e3f8g', age: 42,
        followers: [],
        following: []
    },
];

export const USER_ROLE_OPTIONS = [UserRole.USER, UserRole.RESOLVER, UserRole.ADMIN];