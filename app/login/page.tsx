'use client';

import { useState } from 'react';
import styles from './login.module.scss';
import Link from 'next/link';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt with:', { email, password });
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
          
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="📩 Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="🔒 Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
          
          <Link href="/forgot-password" className={styles.forgotPassword}>
            Forgot Password
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
