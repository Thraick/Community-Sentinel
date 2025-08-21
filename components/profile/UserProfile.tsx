import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { useApp } from '../../context/AppContext';
import ReportCard from '../feed/ReportCard';
import Button from '../ui/Button';
import { View } from '../../App';
import Modal from '../ui/Modal';

interface UserProfileProps {
    user: User;
    setCurrentView: (view: View) => void;
}

type ProfileTab = 'reports' | 'details' | 'security' | 'followers' | 'following';

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
                        <button onClick={() => handleUserClick(u.id)} className="flex items-center space-x-3 w-full text-left p-2 rounded-md hover:bg-slate-100">
                            <img src={u.avatarUrl} alt={u.name} className="w-10 h-10 rounded-full" />
                            <span className="font-semibold">{u.name}</span>
                        </button>
                    </li>
                )) : <p className="text-slate-500">No users to display.</p>}
            </ul>
        </Modal>
    );
};

const UserProfile: React.FC<UserProfileProps> = ({ user, setCurrentView }) => {
    const { issueReports, authenticatedUser, toggleFollow, updateUserProfile, regenerateApiKey } = useApp();
    const [activeTab, setActiveTab] = useState<ProfileTab>('reports');
    const [isFollowersModalOpen, setFollowersModalOpen] = useState(false);
    const [isFollowingModalOpen, setFollowingModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(user.name);
    const [editAvatar, setEditAvatar] = useState(user.avatarUrl);
    const [editAge, setEditAge] = useState(user.age || '');

    useEffect(() => {
        setEditName(user.name);
        setEditAvatar(user.avatarUrl);
        setEditAge(user.age || '');
        setActiveTab('reports');
    }, [user]);

    const userReports = issueReports.filter(p => p.authorId === user.id && !p.isAnonymous);
    const isOwnProfile = authenticatedUser?.id === user.id;
    const isFollowing = authenticatedUser?.following.includes(user.id) ?? false;

    const handleProfileUpdate = () => {
        updateUserProfile({ name: editName, avatarUrl: editAvatar, age: Number(editAge) || undefined })
            .then(() => setIsEditing(false));
    };
    
    const handleApiKeyRegen = () => {
        if (window.confirm("Are you sure? Your old API key will be invalidated immediately.")) {
            regenerateApiKey();
        }
    }
    
    const getTabClass = (tab: ProfileTab) => `px-3 py-2 font-semibold text-sm rounded-md ${activeTab === tab ? 'bg-indigo-600 text-white' : 'hover:bg-slate-200'}`;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row items-center sm:space-x-4">
                    <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full border-4 border-indigo-200" />
                    <div className="flex-1 text-center sm:text-left mt-4 sm:mt-0">
                        <h2 className="text-3xl font-bold text-slate-800">{user.name}</h2>
                        <p className="text-md text-slate-500">{user.role}</p>
                    </div>
                    {!isOwnProfile && authenticatedUser && (
                         <Button onClick={() => toggleFollow(user.id)} variant={isFollowing ? 'secondary' : 'primary'}>
                             {isFollowing ? 'Unfollow' : 'Follow'}
                         </Button>
                    )}
                </div>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-200 pt-4 text-center">
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <p className="text-sm text-slate-500">Reports</p>
                        <p className="text-2xl font-bold text-slate-800">{userReports.length}</p>
                    </div>
                    <button onClick={() => setFollowersModalOpen(true)} className="bg-slate-50 p-4 rounded-lg hover:bg-slate-100 w-full">
                        <p className="text-sm text-slate-500">Followers</p>
                        <p className="text-2xl font-bold text-slate-800">{user.followers.length}</p>
                    </button>
                    <button onClick={() => setFollowingModalOpen(true)} className="bg-slate-50 p-4 rounded-lg hover:bg-slate-100 w-full">
                        <p className="text-sm text-slate-500">Following</p>
                        <p className="text-2xl font-bold text-slate-800">{user.following.length}</p>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 border-b border-slate-200">
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
                                    {userReports.map(report => <ReportCard key={report.id} report={report} setCurrentView={setCurrentView} />)}
                                </div>
                            ) : (
                                <p className="text-slate-500 text-center">{isOwnProfile ? "You haven't" : `${user.name} hasn't`} made any public reports yet.</p>
                            )}
                        </div>
                    )}
                     {activeTab === 'details' && isOwnProfile && (
                        <div>
                            <h3 className="text-xl font-bold text-slate-700 mb-4">Edit Your Details</h3>
                             <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input type="text" value={editName} onChange={e => setEditName(e.target.value)} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm disabled:bg-slate-50" />
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
                                    <input type="text" value={editAvatar} onChange={e => setEditAvatar(e.target.value)} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm disabled:bg-slate-50" />
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700">Age</label>
                                    <input type="number" value={editAge} onChange={e => setEditAge(e.target.value)} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm disabled:bg-slate-50" />
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
                    )}
                    {activeTab === 'security' && isOwnProfile && (
                         <div>
                            <h3 className="text-xl font-bold text-slate-700 mb-4">Security Settings</h3>
                            <div className="space-y-2">
                                <h4 className="font-semibold text-slate-700">Your API Key</h4>
                                <p className="text-sm text-slate-500 bg-slate-100 p-2 rounded-md font-mono mt-1 break-all">{user.apiKey}</p>
                                <Button onClick={handleApiKeyRegen} variant="secondary">Generate New Key</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <UserListModal title="Followers" userIds={user.followers} isOpen={isFollowersModalOpen} onClose={() => setFollowersModalOpen(false)} setCurrentView={setCurrentView} />
            <UserListModal title="Following" userIds={user.following} isOpen={isFollowingModalOpen} onClose={() => setFollowingModalOpen(false)} setCurrentView={setCurrentView} />
        </div>
    );
};

export default UserProfile;