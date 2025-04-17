'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser, CreateUserRequest } from '../../services/userApi';
import DashboardLayout from '../../components/DashboardLayout';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import styles from './create.module.scss';

const CreateUserPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<CreateUserRequest>({
    email: 'bae@example.com',
    mat_khau: '123456',
    ho_ten: 'Bae Kháng',
    dia_chi: 'FPT Polytechnic',
    dien_thoai: '0987654321',
    vai_tro: 1,
    khoa: 0,
    hinh: 'avatar.png'
  });

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
    setLoading(true);
    setError('');

    try {
      const newUser = await createUser(formData);
      if (newUser) {
        router.push('/users');
      } else {
        setError('Failed to create user');
      }
    } catch (err) {
      setError('An error occurred while creating the user');
      console.error('Error creating user:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/users" className={styles.backButton}>
            <ArrowLeft size={18} />
            <span>Back to Users</span>
          </Link>
          <h1>Create New User</h1>
        </div>

        <div className={styles.formContainer}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className={styles.sampleData}>
            <h3>Sample API Request Format</h3>
            <pre>
              {`{
  "email": "bae@example.com",
  "mat_khau": "123456",
  "ho_ten": "Bae Kháng",
  "dia_chi": "FPT Polytechnic",
  "dien_thoai": "0987654321",
  "vai_tro": 1,
  "khoa": 0,
  "hinh": "avatar.png"
}`}
            </pre>
            <p>Form has been pre-filled with these values for convenience.</p>
          </div>

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
                <label htmlFor="mat_khau">Password</label>
                <input
                  type="password"
                  id="mat_khau"
                  name="mat_khau"
                  value={formData.mat_khau}
                  onChange={handleChange}
                  required
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
                  value={formData.hinh}
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
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateUserPage; 