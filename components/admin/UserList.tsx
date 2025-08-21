import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, User } from '../../types';
import { View } from '../../App';
import Button from '../ui/Button';

interface UserListProps {
    setCurrentView: (view: View) => void;
}

const UserList: React.FC<UserListProps> = ({ setCurrentView }) => {
    const { users, issueReports, authenticatedUser, updateUserRole, blockUser } = useApp();

    const handleRoleChange = (user: User, newRole: UserRole) => {
        if (window.confirm(`Are you sure you want to change ${user.name}'s role to ${newRole}?`)) {
            updateUserRole(user.id, newRole);
        }
    };
    
    const handleBlock = (user: User) => {
        if (window.confirm(`Are you sure you want to BLOCK ${user.name}? This is irreversible and will hide all their content.`)) {
            blockUser(user.id);
        }
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(user => {
                        const reportCount = issueReports.filter(p => p.authorId === user.id).length;
                        const reportsMadeCount = issueReports.reduce((acc, report) => {
                            return acc + report.reports.filter(r => r.reporterId === user.id).length +
                                   report.comments.reduce((cAcc, c) => cAcc + c.reports.filter(r => r.reporterId === user.id).length, 0);
                        }, 0);

                        return (
                            <tr key={user.id} className={user.isBlocked ? 'bg-red-50' : ''}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button onClick={() => setCurrentView({ type: 'profile', userId: user.id })} className="flex items-center text-left hover:underline">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt={user.name} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.name} {user.isBlocked && '(Blocked)'}</div>
                                             <div className="text-xs text-gray-500">{user.email}</div>
                                        </div>
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === UserRole.ADMIN ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div>{reportCount} Reports</div>
                                    <div>{reportsMadeCount} Reports Made</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-1">
                                    {authenticatedUser?.id !== user.id && !user.isBlocked && (
                                        <>
                                            {user.role === UserRole.USER && (
                                                <Button onClick={() => handleRoleChange(user, UserRole.RESOLVER)} variant="secondary" className="text-xs py-1">Make Resolver</Button>
                                            )}
                                            {user.role === UserRole.RESOLVER && (
                                                <Button onClick={() => handleRoleChange(user, UserRole.ADMIN)} variant="secondary" className="text-xs py-1">Make Admin</Button>
                                            )}
                                             <Button onClick={() => handleBlock(user)} variant="danger" className="text-xs py-1">Block</Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;