import { User, UserRole, IssueReport, IssueStatus, ReactionType } from './types';

// In a real app, this data would come from a database.
// Passwords are included for the mock login system. DO NOT do this in production.
export const ALL_USERS: User[] = [
    { 
        id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com', password: 'password', 
        avatarUrl: 'https://i.pravatar.cc/150?u=user-1', role: UserRole.USER,
        apiKey: 'u1-a7b3c9f2-e8d1-4f6a-b2c5-3d1e7f0a9b4c', age: 28, theme: 'light', bio: 'Community advocate focused on local infrastructure and safety.',
        followers: ['user-2', 'user-5', 'user-9', 'user-12'],
        following: ['user-2', 'user-3', 'user-4', 'user-15']
    },
    { 
        id: 'user-2', name: 'Bob Williams', email: 'bob@example.com', password: 'password',
        avatarUrl: 'https://i.pravatar.cc/150?u=user-2', role: UserRole.USER,
        apiKey: 'u2-b8c4d0g3-f9e2-5g7b-c3d6-4e2f8g1b0c5d', age: 34, theme: 'light', bio: 'Just trying to make our neighborhood a better place, one report at a time.',
        followers: ['user-1', 'user-3'],
        following: ['user-1']
    },
    { 
        id: 'user-3', name: 'Charlie Brown', email: 'charlie@example.com', password: 'password',
        avatarUrl: 'https://i.pravatar.cc/150?u=user-3', role: UserRole.USER,
        apiKey: 'u3-c9d5e1h4-g0f3-6h8c-d4e7-5f3g9h2c1d6e', age: 45, theme: 'dark', bio: 'Long-time resident. I\'ve seen it all.',
        followers: ['user-1'],
        following: ['user-2']
    },
    { 
        id: 'user-4', name: 'Diana Prince', email: 'resolver@example.com', password: 'password',
        avatarUrl: 'https://i.pravatar.cc/150?u=user-4', role: UserRole.RESOLVER,
        apiKey: 'u4-d0e6f2i5-h1g4-7i9d-e5f8-6g4h0i3d2e7f', age: 31, theme: 'light', bio: 'Official City Resolver. Here to help address your concerns.',
        followers: ['user-1'],
        following: []
    },
    { 
        id: 'user-5', name: 'Ethan Hunt', email: 'admin@example.com', password: 'admin',
        avatarUrl: 'https://i.pravatar.cc/150?u=user-5', role: UserRole.ADMIN,
        apiKey: 'u5-e1f7g3j6-i2h5-8j0e-f6g9-7h5i1j4e3f8g', age: 42, theme: 'dark', bio: 'Keeping the platform safe and operational.',
        followers: [],
        following: ['user-1']
    },
     { 
        id: 'user-6', name: 'Fiona Glenanne', email: 'fiona@example.com', password: 'password', 
        avatarUrl: 'https://i.pravatar.cc/150?u=user-6', role: UserRole.USER,
        apiKey: 'u6-a7b3c9f2-e8d1-4f6a-b2c5-3d1e7f0a9b4d', age: 35, theme: 'dark', bio: 'New to the neighborhood and ready to help out.',
        followers: [],
        following: []
    },
    { 
        id: 'user-7', name: 'George Mason', email: 'george@example.com', password: 'password', 
        avatarUrl: 'https://i.pravatar.cc/150?u=user-7', role: UserRole.USER,
        apiKey: 'u7-b8c4d0g3-f9e2-5g7b-c3d6-4e2f8g1b0c5e', age: 52, theme: 'light', bio: 'Retired and keeping an eye on things.',
        followers: ['user-18'],
        following: ['user-19']
    },
     { 
        id: 'user-8', name: 'Hannah Abbott', email: 'resolver2@example.com', password: 'password',
        avatarUrl: 'https://i.pravatar.cc/150?u=user-8', role: UserRole.RESOLVER,
        apiKey: 'u8-d0e6f2i5-h1g4-7i9d-e5f8-6g4h0i3d2e7g', age: 29, theme: 'dark', bio: 'Public Works Department liaison.',
        followers: [],
        following: []
    },
    {
        id: 'user-9', name: 'Ivy Green', email: 'ivy@example.com', password: 'password',
        avatarUrl: 'https://i.pravatar.cc/150?u=user-9', role: UserRole.USER,
        apiKey: 'u9-f2i5d0e6-7i9dh1-g4e5-f86g4h0i3d2e7h', age: 25, theme: 'light', bio: 'Lover of parks and green spaces.',
        followers: [],
        following: ['user-1']
    },
    {
        id: 'user-10', name: 'Jack Stone', email: 'jack@example.com', password: 'password',
        avatarUrl: 'https://i.pravatar.cc/150?u=user-10', role: UserRole.USER,
        apiKey: 'u10-g3j6e1f7-8j0ei2-h5f6-g97h5i1j4e3f8i', age: 48, theme: 'dark', bio: 'Construction worker, reporting infrastructure issues.',
        followers: [],
        following: []
    },
    {
        id: 'user-11', name: 'Karen Page', email: 'resolver3@example.com', password: 'password',
        avatarUrl: 'https://i.pravatar.cc/150?u=user-11', role: UserRole.RESOLVER,
        apiKey: 'u11-h4k7f2i5-9k1eh3-g6f7-g08h6i2k5e4f9j', age: 33, theme: 'light', bio: 'Department of Transportation coordinator.',
        followers: [],
        following: []
    },
    {
        id: 'user-12', name: 'Liam Smith', email: 'liam@example.com', password: 'password',
        avatarUrl: 'https://i.pravatar.cc/150?u=user-12', role: UserRole.USER,
        apiKey: 'u12-i5l8g3j6-k3h6-9k1f-g7h0-8h6j2k5f4g9k', age: 22, theme: 'dark', bio: 'Student and part-time delivery driver. I see a lot of road issues.',
        followers: ['user-1', 'user-9'],
        following: ['user-10']
    },
    {
        id: 'user-13', name: 'Mia Garcia', email: 'mia@example.com', password: 'password',
        avatarUrl: 'https://i.pravatar.cc/150?u=user-13', role: UserRole.USER,
        apiKey: 'u13-j6m9h4k7-l4i7-0l2g-h8i1-9i7k3l6g5h0l', age: 38, theme: 'light', bio: 'Local artist, cares about public spaces.',
        followers: [],
        following: []
    },
    {
        id: 'user-14', name: 'Noah Taylor', email: 'noah@example.com', password: 'password',
        avatarUrl: 'https://i.pravatar.cc/150?u=user-14', role: UserRole.USER,
        apiKey: 'u14-k7n0i5l8-m5j8-1m3h-i9j2-0j8l4m7h6i1m', age: 41, theme: 'dark', bio: 'Keeping our streets clean.',
        followers: [],
        following: []
    },
    {
        id: 'user-15', name: 'Olivia Martinez', email: 'resolver4@example.com', password: 'password',
        avatarUrl: 'https://i.pravatar.cc/150?u=user-15', role: UserRole.RESOLVER,
        apiKey: 'u15-l8o1j6m9-n6k9-2n4i-j0k3-1k9m5n8i7j2n', age: 36, theme: 'light', bio: 'Parks and Recreation department head.',
        followers: ['user-1'],
        following: []
    },
    {
        id: 'user-16', name: 'Peter Jones', email: 'peter@example.com', password: 'password',
        avatarUrl: 'https://i.pravatar.cc/150?u=user-16', role: UserRole.USER,
        apiKey: 'u16-m9p2k7n0-o7l0-3o5j-k1l4-2l0n6o9j8k3o', age: 65, theme: 'dark', bio: 'Community watch captain.',
        followers: [],
        following: []
    },
    {
        id: 'user-17', name: 'Quinn Davis', email: 'quinn@example.com', password: 'password',
        avatarUrl: 'https://i.pravatar.cc/150?u=user-17', role: UserRole.USER,
        apiKey: 'u17-n0q3l8o1-p8m1-4p6k-l2m5-3m1o7p0k9l4p', age: 29, theme: 'light', bio: 'Cyclist and pedestrian safety advocate.',
        followers: [],
        following: []
    },
    {
        id: 'user-18', name: 'Rachel Wilson', email: 'rachel@example.com', password: 'password',
        avatarUrl: 'https://i.pravatar.cc/150?u=user-18', role: UserRole.USER,
        apiKey: 'u18-o1r4m9p2-q9n2-5q7l-m3n6-4n2p8q1l0m5q', age: 31, theme: 'dark', bio: 'Dog owner, concerned about park maintenance.',
        followers: [],
        following: ['user-7']
    },
    {
        id: 'user-19', name: 'Sam Evans', email: 'resolver5@example.com', password: 'password',
        avatarUrl: 'https://i.pravatar.cc/150?u=user-19', role: UserRole.RESOLVER,
        apiKey: 'u19-p2s5n0q3-r0o3-6r8m-n4o7-5o3q9r2m1n6r', age: 45, theme: 'light', bio: 'Sanitation department supervisor.',
        followers: ['user-7'],
        following: []
    },
    {
        id: 'user-20', name: 'Tina Rodriguez', email: 'tina@example.com', password: 'password',
        avatarUrl: 'https://i.pravatar.cc/150?u=user-20', role: UserRole.USER,
        apiKey: 'u20-q3t6o1r4-s1p4-7s9n-o5p8-6p4r0s3n2o7s', age: 50, theme: 'dark', bio: 'Local business owner on Main Street.',
        followers: [],
        following: []
    }
];

export const INITIAL_REPORTS: IssueReport[] = [
    {
        id: 'report-1', authorId: 'user-2', isAnonymous: false,
        text: 'There is a massive pothole on Elm Street right before the elementary school. It\'s a serious hazard for cars and cyclists. I almost lost control of my bike this morning!',
        mediaUrl: 'https://picsum.photos/seed/pothole/800/600',
        tags: ['#pothole', '#safety', '#infrastructure'], mentions: [],
        reactions: [
            { userId: 'user-1', type: ReactionType.LIKE }, 
            { userId: 'user-3', type: ReactionType.LIKE },
            { userId: 'user-4', type: ReactionType.LIKE },
            { userId: 'user-7', type: ReactionType.LIKE },
            { userId: 'user-12', type: ReactionType.LIKE }
        ],
        comments: [
            { id: 'comment-1-1', authorId: 'user-3', text: 'I hit that yesterday! The city needs to fix this ASAP.', timestamp: new Date(Date.now() - 3600000 * 2), reports: [], reactions: [{userId: 'user-1', type: ReactionType.LIKE}, {userId: 'user-2', type: ReactionType.LIKE}] },
            { id: 'comment-1-2', authorId: 'user-1', text: 'Thanks for reporting. I\'ve sent a complaint to the public works department.', timestamp: new Date(Date.now() - 3600000 * 1), reports: [], reactions: [] },
            { id: 'comment-1-3', authorId: 'user-12', text: 'My dad blew a tire on this last week. It\'s getting worse.', timestamp: new Date(Date.now() - 3600000 * 0.5), reports: [], reactions: [{userId: 'user-3', type: ReactionType.SAD}]}
        ],
        reports: [], timestamp: new Date(Date.now() - 3600000 * 3), status: IssueStatus.IN_PROGRESS, resolverId: 'user-4'
    },
    {
        id: 'report-2', authorId: 'user-3', isAnonymous: true,
        text: 'A blue sedan has been parked in front of a fire hydrant on Main Street for three days now. License plate is ABC-123.',
        tags: ['#parking', '#safety', '#hazard'], mentions: [],
        reactions: [
            { userId: 'user-1', type: ReactionType.LIKE }, 
            { userId: 'user-16', type: ReactionType.LIKE },
            { userId: 'user-20', type: ReactionType.DISLIKE }
        ], 
        comments: [
            { id: 'comment-2-1', authorId: 'user-20', text: 'That car belongs to the new tenant at 24B. I\'ve told them to move it twice.', timestamp: new Date(Date.now() - 3600000 * 4), reports: [], reactions: [] }
        ],
        reports: [{ reporterId: 'user-2', isAnonymous: false, reason: 'This issue is critical and needs immediate attention.', timestamp: new Date(Date.now() - 3600000 * 5) }],
        timestamp: new Date(Date.now() - 3600000 * 6), status: IssueStatus.UNDER_REVIEW,
    },
     {
        id: 'report-3', authorId: 'user-1', isAnonymous: false,
        text: 'Someone has been illegally dumping trash and old furniture behind the community park. It\'s becoming an eyesore and a health hazard.',
        mediaUrl: 'https://picsum.photos/seed/dumping/800/600',
        tags: ['#illegal-dumping', '#community', '#hazard'], mentions: [], 
        reactions: [
            { userId: 'user-2', type: ReactionType.SAD }, 
            { userId: 'user-3', type: ReactionType.DISLIKE },
            { userId: 'user-14', type: ReactionType.DISLIKE },
            { userId: 'user-18', type: ReactionType.DISLIKE }
        ], 
        comments: [
             { id: 'comment-3-1', authorId: 'user-3', text: 'This is awful. I hope they get caught.', timestamp: new Date(Date.now() - 3600000 * 20), reports: [], reactions: [] },
             { id: 'comment-3-2', authorId: 'user-14', text: 'I saw a white pickup truck back there late Tuesday night. Didn\'t get a plate number though.', timestamp: new Date(Date.now() - 3600000 * 18), reports: [], reactions: [{userId: 'user-1', type: ReactionType.LIKE}]}
        ],
        reports: [],
        timestamp: new Date(Date.now() - 3600000 * 22), status: IssueStatus.IN_PROGRESS,
        resolverId: 'user-19'
    },
     {
        id: 'report-4', authorId: 'user-4', isAnonymous: false,
        text: 'The street light at the corner of Oak & Pine has been out for over a week. It\'s very dark and feels unsafe at night.',
        tags: ['#street-light', '#safety'], mentions: [], 
        reactions: [{ userId: 'user-7', type: ReactionType.LIKE}, { userId: 'user-16', type: ReactionType.LIKE}], 
        comments: [],
        reports: [],
        timestamp: new Date(Date.now() - 3600000 * 26), status: IssueStatus.RESOLVED,
        resolutionNote: 'A work order was created with the city electrical department. They have confirmed the light has been repaired as of this morning. Ticket #8432.',
        resolverId: 'user-4'
    },
    {
        id: 'report-5', authorId: 'user-6', isAnonymous: false,
        text: 'The crosswalk signal at the intersection of 5th and Broadway is not working correctly. The "Walk" sign only stays on for 3 seconds.',
        tags: ['#traffic', '#safety', '#pedestrian'], mentions: [],
        reactions: [{ userId: 'user-1', type: ReactionType.LIKE }, { userId: 'user-7', type: ReactionType.LIKE }, { userId: 'user-17', type: ReactionType.LIKE }],
        comments: [
            { id: 'comment-5-1', authorId: 'user-17', text: 'As a cyclist, this intersection is a nightmare. This needs to be a priority.', timestamp: new Date(Date.now() - 86400000 * 1.5), reports: [], reactions: [] }
        ],
        reports: [],
        timestamp: new Date(Date.now() - 86400000 * 2), status: IssueStatus.IN_PROGRESS,
        resolverId: 'user-11'
    },
    {
        id: 'report-6', authorId: 'user-7', isAnonymous: false,
        text: 'A large tree branch has fallen and is blocking the sidewalk on Park Avenue near the library entrance.',
        mediaUrl: 'https://picsum.photos/seed/treebranch/800/600',
        tags: ['#hazard', '#infrastructure'], mentions: [],
        reactions: [{ userId: 'user-2', type: ReactionType.LIKE }],
        comments: [],
        reports: [],
        timestamp: new Date(Date.now() - 86400000 * 3), status: IssueStatus.RESOLVED,
        resolverId: 'user-8',
        resolutionNote: 'Public works has cleared the branch. The sidewalk is now accessible.'
    },
    {
        id: 'report-7', authorId: 'user-1', isAnonymous: false,
        text: 'Graffiti on the community center wall. It appeared overnight.',
        tags: ['#community', '#vandalism'], mentions: [],
        reactions: [{ userId: 'user-3', type: ReactionType.DISLIKE }, { userId: 'user-13', type: ReactionType.SAD}],
        comments: [],
        reports: [],
        timestamp: new Date(Date.now() - 86400000 * 4), status: IssueStatus.IN_PROGRESS,
        resolverId: 'user-8'
    },
    {
        id: 'report-8', authorId: 'user-2', isAnonymous: false,
        text: 'The recycling bins at Greenfield Park are overflowing. They haven\'t been collected in over a week.',
        mediaUrl: 'https://picsum.photos/seed/recycling/800/600',
        tags: ['#community', '#sanitation'], mentions: [],
        reactions: [],
        comments: [],
        reports: [],
        timestamp: new Date(Date.now() - 86400000 * 5), status: IssueStatus.ACTIVE,
    },
    {
        id: 'report-9', authorId: 'user-9', isAnonymous: false,
        text: 'The public fountain in the town square is broken and leaking water everywhere.',
        tags: ['#infrastructure', '#community', '#water'], mentions: [],
        reactions: [{ userId: 'user-1', type: ReactionType.SAD }, { userId: 'user-10', type: ReactionType.LIKE }],
        comments: [],
        reports: [],
        timestamp: new Date(Date.now() - 86400000 * 6), status: IssueStatus.ACTIVE
    },
    {
        id: 'report-10', authorId: 'user-10', isAnonymous: false,
        text: 'There\'s a fence around the construction site on 1st Ave that has fallen over, exposing a dangerous area.',
        mediaUrl: 'https://picsum.photos/seed/construction/800/600',
        tags: ['#safety', '#hazard', '#construction'], mentions: [],
        reactions: [{ userId: 'user-7', type: ReactionType.LIKE }],
        comments: [],
        reports: [],
        timestamp: new Date(Date.now() - 86400000 * 7), status: IssueStatus.RESOLVED,
        resolverId: 'user-4',
        resolutionNote: 'Contacted the site manager. The fence has been secured.'
    },
    {
        id: 'report-11', authorId: 'user-6', isAnonymous: false,
        text: 'Speeding cars on Maple Lane are a constant problem, especially with kids playing. We need speed bumps.',
        tags: ['#traffic', '#safety', '#community'], mentions: [],
        reactions: [{ userId: 'user-1', type: ReactionType.LIKE }, { userId: 'user-2', type: ReactionType.LIKE }, { userId: 'user-9', type: ReactionType.LIKE }],
        comments: [],
        reports: [],
        timestamp: new Date(Date.now() - 86400000 * 8), status: IssueStatus.UNDER_REVIEW,
        resolverId: 'user-11'
    },
    {
        id: 'report-12', authorId: 'user-1', isAnonymous: true,
        text: 'The noise from the bar on the corner goes on well past 2 AM on weeknights.',
        tags: ['#noise', '#community'], mentions: [],
        reactions: [{userId: 'user-3', type: ReactionType.DISLIKE}, {userId: 'user-7', type: ReactionType.DISLIKE}],
        comments: [
            { id: 'comment-12-1', authorId: 'user-3', text: 'I live two blocks away and can hear it. It\'s ridiculous.', timestamp: new Date(Date.now() - 86400000 * 8.5), reports: [], reactions: [] }
        ],
        reports: [],
        timestamp: new Date(Date.now() - 86400000 * 9), status: IssueStatus.ACTIVE
    },
    {
        id: 'report-13', authorId: 'user-9', isAnonymous: false,
        text: 'The basketball court at Central Park has a cracked surface and the nets are torn. It\'s unusable for a proper game.',
        mediaUrl: 'https://picsum.photos/seed/basketball/800/600',
        tags: ['#community', '#park', '#infrastructure'], mentions: [],
        reactions: [
            { userId: 'user-10', type: ReactionType.SAD },
            { userId: 'user-12', type: ReactionType.LIKE },
            { userId: 'user-2', type: ReactionType.LIKE },
        ],
        comments: [
             { id: 'comment-13-1', authorId: 'user-10', text: 'Yeah, it\'s been like that for months. I twisted my ankle there last spring.', timestamp: new Date(Date.now() - 86400000 * 9), reports: [], reactions: [{userId: 'user-9', type: ReactionType.SAD}] },
        ],
        reports: [],
        timestamp: new Date(Date.now() - 86400000 * 10), status: IssueStatus.ACTIVE
    },
    {
        id: 'report-14', authorId: 'user-18', isAnonymous: false,
        text: 'There are no bags in the dog waste dispenser at the entrance to the dog park. It\'s been empty for days.',
        tags: ['#park', '#community', '#sanitation'], mentions: [],
        reactions: [
            { userId: 'user-9', type: ReactionType.LIKE },
        ],
        comments: [],
        reports: [],
        timestamp: new Date(Date.now() - 86400000 * 11), status: IssueStatus.IN_PROGRESS,
        resolverId: 'user-15'
    },
    {
        id: 'report-15', authorId: 'user-20', isAnonymous: false,
        text: 'The delivery trucks for the supermarket on Main Street are blocking the bike lane every morning between 8 AM and 9 AM.',
        tags: ['#traffic', '#safety', '#hazard'], mentions: [],
        reactions: [
            { userId: 'user-17', type: ReactionType.LIKE },
            { userId: 'user-12', type: ReactionType.LIKE },
        ],
        comments: [],
        reports: [],
        timestamp: new Date(Date.now() - 86400000 * 12), status: IssueStatus.UNDER_REVIEW,
        resolverId: 'user-11'
    },
    {
        id: 'report-16', authorId: 'user-16', isAnonymous: false,
        text: 'A group of teenagers is consistently loitering and making a lot of noise in the library parking lot after hours.',
        tags: ['#community', '#safety', '#noise'], mentions: [],
        reactions: [
            { userId: 'user-7', type: ReactionType.DISLIKE },
        ],
        comments: [],
        reports: [],
        timestamp: new Date(Date.now() - 86400000 * 13), status: IssueStatus.ACTIVE
    },
    {
        id: 'report-17', authorId: 'user-13', isAnonymous: false,
        text: 'The mural at the bus station has been vandalized with spray paint.',
        mediaUrl: 'https://picsum.photos/seed/mural/800/600',
        tags: ['#vandalism', '#community'], mentions: [],
        reactions: [
            { userId: 'user-1', type: ReactionType.SAD },
            { userId: 'user-9', type: ReactionType.SAD },
        ],
        comments: [],
        reports: [],
        timestamp: new Date(Date.now() - 86400000 * 14), status: IssueStatus.RESOLVED,
        resolverId: 'user-8',
        resolutionNote: 'Graffiti has been removed by the city\'s cleanup crew.'
    },
    {
        id: 'report-18', authorId: 'user-14', isAnonymous: false,
        text: 'The sidewalk on Washington Blvd is completely buckled by a tree root, making it inaccessible for wheelchairs.',
        tags: ['#infrastructure', '#safety', '#hazard'], mentions: [],
        reactions: [
            { userId: 'user-2', type: ReactionType.LIKE },
        ],
        comments: [],
        reports: [],
        timestamp: new Date(Date.now() - 86400000 * 15), status: IssueStatus.ACTIVE
    },
    {
        id: 'report-19', authorId: 'user-1', isAnonymous: false,
        text: 'The public Wi-Fi at the town hall is incredibly slow and unreliable.',
        tags: ['#community', '#infrastructure'], mentions: [],
        reactions: [
            { userId: 'user-12', type: ReactionType.LIKE },
        ],
        comments: [],
        reports: [],
        timestamp: new Date(Date.now() - 86400000 * 16), status: IssueStatus.ACTIVE
    },
    {
        id: 'report-20', authorId: 'user-7', isAnonymous: false,
        text: 'The historic landmark plaque in the town square has a typo on it.',
        tags: ['#community', '#infrastructure'], mentions: [],
        reactions: [
            { userId: 'user-3', type: ReactionType.LAUGH },
        ],
        comments: [
             { id: 'comment-20-1', authorId: 'user-3', text: 'I\'ve lived here 40 years and never noticed that! Good eye.', timestamp: new Date(Date.now() - 86400000 * 16.5), reports: [], reactions: [{userId: 'user-7', type: ReactionType.LIKE}] }
        ],
        reports: [],
        timestamp: new Date(Date.now() - 86400000 * 17), status: IssueStatus.RESOLVED,
        resolverId: 'user-15',
        resolutionNote: 'The Historical Society has been notified and a replacement plaque has been ordered.'
    },
    {
        id: 'report-21', authorId: 'user-17', isAnonymous: false,
        text: 'The bike racks outside the train station are always full. We desperately need more bike parking.',
        tags: ['#traffic', '#community', '#infrastructure'], mentions: [],
        reactions: [{ userId: 'user-12', type: ReactionType.LIKE }, { userId: 'user-6', type: ReactionType.LIKE }],
        comments: [],
        reports: [],
        timestamp: new Date(Date.now() - 86400000 * 18), status: IssueStatus.UNDER_REVIEW,
        resolverId: 'user-11'
    },
    {
        id: 'report-22', authorId: 'user-19', isAnonymous: false,
        text: 'Observed a city sanitation truck leaking hydraulic fluid all over Jefferson street this morning.',
        tags: ['#hazard', '#sanitation'], mentions: [],
        reactions: [],
        comments: [],
        reports: [],
        timestamp: new Date(Date.now() - 86400000 * 19), status: IssueStatus.IN_PROGRESS,
        resolverId: 'user-19'
    }
];


export const USER_ROLE_OPTIONS = [UserRole.USER, UserRole.RESOLVER, UserRole.ADMIN];