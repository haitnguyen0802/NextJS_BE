import { Menu } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from './Header.module.scss'; // Import SCSS module
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  toggleSidebar: () => void;
  isMobile: boolean;
}

const Header = ({ toggleSidebar, isMobile }: HeaderProps) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__left}>
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className={styles.header__mobileToggle}
          >
            <Menu />
          </button>
        )}
        
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Search"
            className={styles.search__input}
          />
          <svg
            className={styles.search__icon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className={styles.header__right}>
        {/* Notification */}
        <button className={styles.notificationButton}>
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className={styles.notificationButton__badge} />
        </button>

        {/* Profile - update to use user from auth context */}
        {user && (
          <div className={styles.profileSection}>
            <button className={styles.profileButton}>
              <div className={styles.profileButton__avatar}>
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    fill
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className={styles.profileButton__info}>
                <p className={styles.profileButton__name}>{user.name}</p>
                <p className={styles.profileButton__role}>
                  {user.role === 1 ? 'Administrator' : 'User'}
                </p>
              </div>
            </button>
            
            <button 
              className={styles.logoutButton}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 