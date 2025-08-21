import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../../types';
import { useApp } from '../../context/AppContext';
import ReportCard from '../feed/ReportCard';
import Button from '../ui/Button';
import { View } from '../../App';
import Modal from '../ui/Modal';
import ApiDocsModal from './ApiDocsModal';

interface UserProfileProps {
    user: User;
    setCurrentView: (view: View) => void;
}

type ProfileTab = 'reports' | 'details' | 'security';

const UserListModal: React.FC<{ title: string; userIds: string[]; isOpen: boolean; onClose: () => void; setCurrentView: (view: View) => void }> = ({ title, userIds, isOpen, onClose, setCurrentView }) => {
    const { getUserById } = useApp();
    const users = userIds.map(getUserById).filter((u): u is User => !!u);

    const handleUserClick = (userId: string) => {
        setCurrentView({ type: 'profile', userId });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <ul className="space-y-2">
                {users.length > 0 ? users.map(u => (
                    <li key={u.id}>
                        <button onClick={() => handleUserClick(u.id)} className="flex items-center space-x-3 w-full text-left p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
                            <img src={u.avatarUrl} alt={u.name} className="w-10 h-10 rounded-full" />
                            <span className="font-semibold dark:text-white">{u.name}</span>
                        </button>
                    </li>
                )) : <p className="text-slate-500 dark:text-slate-400">No users to display.</p>}
            </ul>
        </Modal>
    );
};

const UserProfile: React.FC<UserProfileProps> = ({ user, setCurrentView }) => {
    const { issueReports, authenticatedUser, toggleFollow, updateUserProfile, regenerateApiKey, updateUserTheme } = useApp();
    const [activeTab, setActiveTab] = useState<ProfileTab>('reports');
    const [isFollowersModalOpen, setFollowersModalOpen] = useState(false);
    const [isFollowingModalOpen, setFollowingModalOpen] = useState(false);
    const [isApiDocsOpen, setIsApiDocsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // Edit state
    const [editName, setEditName] = useState(user.name);
    const [editAvatar, setEditAvatar] = useState(user.avatarUrl);
    const [editAge, setEditAge] = useState(user.age || '');
    const [editBio, setEditBio] = useState(user.bio || '');

    const handleTagClick = useCallback((tag: string) => {
        // A full implementation would likely navigate to the feed view
        // and apply a filter for the clicked tag. For now, we'll alert.
        alert(`This would normally filter the feed by the tag: ${tag}`);
    }, []);

    useEffect(() => {
        setEditName(user.name);
        setEditAvatar(user.avatarUrl);
        setEditAge(user.age || '');
        setEditBio(user.bio || '');
        setActiveTab('reports');
    }, [user]);

    const userReports = issueReports.filter(p => p.authorId === user.id && !p.isAnonymous);
    const isOwnProfile = authenticatedUser?.id === user.id;
    const isFollowing = authenticatedUser?.following.includes(user.id) ?? false;

    const handleProfileUpdate = () => {
        updateUserProfile({ name: editName, avatarUrl: editAvatar, age: Number(editAge) || undefined, bio: editBio })
            .then(() => setIsEditing(false));
    };

    const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateUserTheme(e.target.checked ? 'dark' : 'light');
    };
    
    const handleApiKeyRegen = () => {
        if (window.confirm("Are you sure? Your old API key will be invalidated immediately.")) {
            regenerateApiKey();
        }
    }
    
    const getTabClass = (tab: ProfileTab) => `px-3 py-2 font-semibold text-sm rounded-md ${activeTab === tab ? 'bg-indigo-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`;

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row items-center sm:space-x-4">
                    <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full border-4 border-indigo-200" />
                    <div className="flex-1 text-center sm:text-left mt-4 sm:mt-0">
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{user.name}</h2>
                        <p className="text-md text-slate-500 dark:text-slate-400">{user.role}</p>
                        {user.bio && <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{user.bio}</p>}
                    </div>
                    {!isOwnProfile && authenticatedUser && (
                         <Button onClick={() => toggleFollow(user.id)} variant={isFollowing ? 'secondary' : 'primary'}>
                             {isFollowing ? 'Unfollow' : 'Follow'}
                         </Button>
                    )}
                </div>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-700 pt-4 text-center">
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Reports</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{userReports.length}</p>
                    </div>
                    <button onClick={() => setFollowersModalOpen(true)} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 w-full">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Followers</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{user.followers.length}</p>
                    </button>
                    <button onClick={() => setFollowingModalOpen(true)} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 w-full">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Following</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{user.following.length}</p>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <nav className="flex space-x-2">
                        <button onClick={() => setActiveTab('reports')} className={getTabClass('reports')}>Public Reports</button>
                        {isOwnProfile && <button onClick={() => setActiveTab('details')} className={getTabClass('details')}>Personal Details</button>}
                        {isOwnProfile && <button onClick={() => setActiveTab('security')} className={getTabClass('security')}>Security</button>}
                    </nav>
                </div>
                <div className="p-6">
                    {activeTab === 'reports' && (
                         <div>
                            {userReports.length > 0 ? (
                                <div className="space-y-6">
                                    {userReports.map(report => <ReportCard key={report.id} report={report} setCurrentView={setCurrentView} onTagClick={handleTagClick} />)}
                                </div>
                            ) : (
                                <p className="text-slate-500 dark:text-slate-400 text-center">{isOwnProfile ? "You haven't" : `${user.name} hasn't`} made any public reports yet.</p>
                            )}
                        </div>
                    )}
                     {activeTab === 'details' && isOwnProfile && (
                        <div>
                            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">Edit Your Details</h3>
                             <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                                    <input type="text" value={editName} onChange={e => setEditName(e.target.value)} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm sm:text-sm disabled:bg-slate-50 dark:disabled:bg-slate-800 text-slate-800 dark:text-slate-100" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                                    <textarea value={editBio} onChange={e => setEditBio(e.target.value)} disabled={!isEditing} rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm sm:text-sm disabled:bg-slate-50 dark:disabled:bg-slate-800 text-slate-800 dark:text-slate-100" />
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Avatar URL</label>
                                    <input type="text" value={editAvatar} onChange={e => setEditAvatar(e.target.value)} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm sm:text-sm disabled:bg-slate-50 dark:disabled:bg-slate-800 text-slate-800 dark:text-slate-100" />
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Age</label>
                                    <input type="number" value={editAge} onChange={e => setEditAge(e.target.value)} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm sm:text-sm disabled:bg-slate-50 dark:disabled:bg-slate-800 text-slate-800 dark:text-slate-100" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                         <label htmlFor="theme-toggle" className="flex items-center cursor-pointer">
                                            <div className="relative">
                                                <input type="checkbox" id="theme-toggle" className="sr-only" checked={authenticatedUser?.theme === 'dark'} onChange={handleThemeChange} />
                                                <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                                                <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                                            </div>
                                            <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">Dark Mode</div>
                                        </label>
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        {isEditing ? (
                                            <>
                                                <Button onClick={() => setIsEditing(false)} variant="secondary">Cancel</Button>
                                                <Button onClick={handleProfileUpdate}>Save Changes</Button>
                                            </>
                                        ) : (
                                            <Button onClick={() => setIsEditing(true)}>Edit</Button>
                                        )}
                                    </div>
                                </div>
                             </div>
                        </div>
                    )}
                    {activeTab === 'security' && isOwnProfile && (
                         <div>
                            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">Security Settings</h3>
                            <div className="space-y-2">
                                <h4 className="font-semibold text-slate-700 dark:text-slate-200">Your API Key</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 p-2 rounded-md font-mono mt-1 break-all">{user.apiKey}</p>
                                <div className="flex space-x-2">
                                    <Button onClick={handleApiKeyRegen} variant="secondary">Generate New Key</Button>
                                    <Button onClick={() => setIsApiDocsOpen(true)}>View API Docs</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <UserListModal title="Followers" userIds={user.followers} isOpen={isFollowersModalOpen} onClose={() => setFollowersModalOpen(false)} setCurrentView={setCurrentView} />
            <UserListModal title="Following" userIds={user.following} isOpen={isFollowingModalOpen} onClose={() => setFollowingModalOpen(false)} setCurrentView={setCurrentView} />
            <ApiDocsModal isOpen={isApiDocsOpen} onClose={() => setIsApiDocsOpen(false)} apiKey={user.apiKey} />
        </div>
    );
};

export default UserProfile;
