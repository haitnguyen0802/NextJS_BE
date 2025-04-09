import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Package,
  List,
  MessageSquare,
  LayoutList,
  Gift,
  Users,
  CreditCard,
  PieChart,
  Settings,
  LogOut
} from "lucide-react";
import styles from './Sidebar.module.scss'; // Import SCSS module

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void; // onClose might be used for mobile overlay click, keeping it
}

const menuItems = [
  { icon: LayoutGrid, label: "Dashboard", href: "/" },
  { icon: Package, label: "Products", href: "/products" },
  { icon: List, label: "Categories", href: "/categories" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: LayoutList, label: "Orders", href: "/orders" },
  { icon: Gift, label: "Deals", href: "/deals" },
  { icon: Users, label: "Users", href: "/users" },
  { icon: CreditCard, label: "Payments", href: "/payments" },
  { icon: PieChart, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const Sidebar = ({ isMobile, isOpen }: SidebarProps) => {
  const pathname = usePathname();

  const sidebarClasses = `
    ${styles.sidebar}
    ${isMobile 
      ? (isOpen ? styles['sidebar--open'] : styles['sidebar--closed'])
      : styles['sidebar--desktop']
    }
  `;

  return (
    <aside className={sidebarClasses}>
      {/* Logo */}
      <div className={styles.logo}>
        <Link href="/" className={styles.logo__link}>
          <div className={styles.logo__icon}>
            <span>D</span>
          </div>
          <span className={styles.logo__text}>DashStack</span>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className={styles.nav}>
        <ul className={styles.menu}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const linkClasses = `
              ${styles.menu__itemLink} 
              ${isActive ? styles['menu__itemLink--active'] : ''}
            `;
            
            return (
              <li key={item.href}>
                <Link href={item.href} className={linkClasses}>
                  <Icon />
                  <span className={styles.menu__itemLabel}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className={styles.logout}>
        <button className={styles.logout__button}>
          <LogOut />
          <span className={styles.logout__label}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar; 