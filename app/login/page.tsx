'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.scss';
import Link from 'next/link';
import { LoginCredentials } from '../services/userApi';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create login credentials
      const credentials: LoginCredentials = {
        identifier,
        password
      };

      // Attempt to login using the auth context
      const success = await login(credentials);

      if (success) {
        // Login successful - redirect to home page
        router.push('/');
      } else {
        // Login failed
        setError('Invalid email/phone or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Left Section - Brand Info */}
      <div className={styles.leftSection}>
        <div className={styles.brand}>
          <h1>WEB 2091 - NextJs 14</h1>
          <p>The most popular peer to peer lending at SEA</p>
        </div>
        <button className={styles.readMoreButton}>Read More</button>
      </div>

      {/* Right Section - Login Form */}
      <div className={styles.rightSection}>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <h2>Đăng nhập nè 🌿</h2>
          <p>Welcome Back</p>
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="📩 Email hoặc Số điện thoại"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="🔒 Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Login'}
          </button>
          
          <Link href="/forgot-password" className={styles.forgotPassword}>
            Forgot Password
          </Link>

          <div className={styles.loginInfo}>
            <p>Demo Account:</p>
            <p>Email: dodatcao@gmail.com</p>
            <p>Điện thoại: 0918765238</p>
            <p>Mật khẩu: 123456</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
