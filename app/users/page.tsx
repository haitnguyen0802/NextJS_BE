'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { User, getAllUsers, deleteUser } from '../services/userApi';
import { MoreVertical, Edit, Trash2, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import styles from './users.module.scss';

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const success = await deleteUser(id);
        if (success) {
          setUsers(users.filter(user => user.id !== id));
        } else {
          alert('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('An error occurred while deleting the user');
      }
    }
    setShowDropdown(null);
  };

  const toggleDropdown = (id: number) => {
    if (showDropdown === id) {
      setShowDropdown(null);
    } else {
      setShowDropdown(id);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleLabel = (role: number) => {
    return role === 1 ? 'Administrator' : 'User';
  };

  return (
    <DashboardLayout>
      <div className={styles.usersContainer}>
        <div className={styles.header}>
          <h1>User Management</h1>
          <Link href="/users/create" className={styles.addButton}>
            <Plus size={18} />
            <span>Add User</span>
          </Link>
        </div>

        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading users...</div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.usersTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>
                        <div className={styles.userCell}>
                          <div className={styles.avatar}>
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} />
                            ) : (
                              <div className={styles.avatarPlaceholder}>
                                {user.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <span className={`${styles.badge} ${user.role === 1 ? styles.adminBadge : styles.userBadge}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${user.isLocked ? styles.lockedBadge : styles.activeBadge}`}>
                          {user.isLocked ? 'Locked' : 'Active'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button 
                            className={styles.actionButton}
                            onClick={() => toggleDropdown(user.id)}
                          >
                            <MoreVertical size={16} />
                          </button>
                          {showDropdown === user.id && (
                            <div className={styles.dropdown}>
                              <Link href={`/users/${user.id}`} className={styles.dropdownItem}>
                                <Edit size={16} />
                                <span>Edit</span>
                              </Link>
                              <button 
                                className={styles.dropdownItem} 
                                onClick={() => handleDelete(user.id)}
                              >
                                <Trash2 size={16} />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className={styles.noResults}>
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UsersPage; 