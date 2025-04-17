'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserById, updateUser, UpdateUserRequest } from '../../services/userApi';
import DashboardLayout from '../../components/DashboardLayout';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import styles from './edit.module.scss';

interface EditUserPageProps {
  params: {
    id: string;
  };
}

const EditUserPage = ({ params }: EditUserPageProps) => {
  const userId = parseInt(params.id, 10);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<UpdateUserRequest>({
    email: '',
    ho_ten: '',
    dia_chi: '',
    dien_thoai: '',
    vai_tro: 0,
    khoa: 0,
    hinh: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserById(userId);
        if (user) {
          setFormData({
            email: user.email,
            ho_ten: user.name,
            dia_chi: user.address,
            dien_thoai: user.phone,
            vai_tro: user.role,
            khoa: user.isLocked ? 1 : 0,
            hinh: user.avatar
          });
        } else {
          setError('User not found');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Error loading user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked ? 1 : 0
      }));
    } else if (name === 'vai_tro' || name === 'khoa') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value, 10)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const updatedUser = await updateUser(userId, formData);
      if (updatedUser) {
        router.push('/users');
      } else {
        setError('Failed to update user');
      }
    } catch (err) {
      setError('An error occurred while updating the user');
      console.error('Error updating user:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.loading}>Loading user data...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/users" className={styles.backButton}>
            <ArrowLeft size={18} />
            <span>Back to Users</span>
          </Link>
          <h1>Edit User</h1>
        </div>

        <div className={styles.formContainer}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="ho_ten">Full Name</label>
                <input
                  type="text"
                  id="ho_ten"
                  name="ho_ten"
                  value={formData.ho_ten}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="mat_khau">Password (leave empty to keep current)</label>
                <input
                  type="password"
                  id="mat_khau"
                  name="mat_khau"
                  value={formData.mat_khau || ''}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="dien_thoai">Phone Number</label>
                <input
                  type="text"
                  id="dien_thoai"
                  name="dien_thoai"
                  value={formData.dien_thoai}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="dia_chi">Address</label>
                <textarea
                  id="dia_chi"
                  name="dia_chi"
                  value={formData.dia_chi}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="hinh">Avatar URL</label>
                <input
                  type="text"
                  id="hinh"
                  name="hinh"
                  value={formData.hinh || ''}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="vai_tro">Role</label>
                <select
                  id="vai_tro"
                  name="vai_tro"
                  value={formData.vai_tro}
                  onChange={handleChange}
                >
                  <option value={0}>User</option>
                  <option value={1}>Administrator</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="khoa">Status</label>
                <select
                  id="khoa"
                  name="khoa"
                  value={formData.khoa}
                  onChange={handleChange}
                >
                  <option value={0}>Active</option>
                  <option value={1}>Locked</option>
                </select>
              </div>
            </div>

            <div className={styles.formActions}>
              <Link href="/users" className={styles.cancelButton}>
                Cancel
              </Link>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditUserPage; 