import { Menu } from "lucide-react";
import Image from "next/image";
import styles from './Header.module.scss'; // Import SCSS module

interface HeaderProps {
  toggleSidebar: () => void;
  isMobile: boolean;
}

const Header = ({ toggleSidebar, isMobile }: HeaderProps) => {
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

        {/* Profile */}
        <button className={styles.profileButton}>
          <div className={styles.profileButton__avatar}>
            <Image
              src="/avatar.jpg" // Make sure this path is correct in your public folder
              alt="Profile"
              fill
            />
          </div>
          <div className={styles.profileButton__info}>
            <p className={styles.profileButton__name}>Moni Roy</p>
            <p className={styles.profileButton__role}>Admin</p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header; 