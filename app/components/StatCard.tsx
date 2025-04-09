import { ReactNode } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import styles from './StatCard.module.scss'; // Import SCSS module

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
  period: string;
  icon: ReactNode;
  iconBg: string; // We'll pass Tailwind class for background
  iconColor: string; // We'll pass Tailwind class for color
}

const StatCard = ({
  title,
  value,
  change,
  trend,
  period,
  icon,
  iconBg,
  iconColor,
}: StatCardProps) => {
  const trendIconClass = trend === "up" ? styles['statCard__trendIcon--up'] : styles['statCard__trendIcon--down'];
  const changeClass = trend === "up" ? styles['statCard__change--up'] : styles['statCard__change--down'];

  return (
    <div className={styles.statCard}>
      <div className={styles.statCard__inner}>
        <div className={styles.statCard__info}>
          <p className={styles.statCard__title}>{title}</p>
          <h3 className={styles.statCard__value}>{value}</h3>
          <div className={styles.statCard__trend}>
            {trend === "up" ? (
              <ArrowUp className={`${styles.statCard__trendIcon} ${trendIconClass}`} />
            ) : (
              <ArrowDown className={`${styles.statCard__trendIcon} ${trendIconClass}`} />
            )}
            <span className={`${styles.statCard__change} ${changeClass}`}>
              {change}%
            </span>
            <span className={styles.statCard__period}>{period}</span>
          </div>
        </div>
        {/* Use inline style or passed Tailwind classes for dynamic colors */}
        <div className={`${styles.statCard__iconWrapper} ${iconBg}`}>
          <div className={`${styles.statCard__icon} ${iconColor}`}>{icon}</div>
        </div>
      </div>
    </div>
  );
};

export default StatCard; 