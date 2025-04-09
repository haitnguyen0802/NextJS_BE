import { useState, useEffect, ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import styles from './DashboardLayout.module.scss'; // Import SCSS module

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, [sidebarOpen]);

  const contentClasses = `
    ${styles.content} 
    ${isMobile ? styles['content--fullWidth'] : styles['content--withSidebar']}
  `;

  return (
    <div className={styles.layout}>
      <Sidebar 
        isMobile={isMobile} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className={contentClasses}>
        <Header 
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />
        
        <main className={styles.main}>
          <div className={styles.main__inner}>
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout; 