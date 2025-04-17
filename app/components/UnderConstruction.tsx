'use client';

import { Wrench, Hammer, ConstructionIcon, RotateCcw } from 'lucide-react';
import styles from './UnderConstruction.module.scss';
import { useRouter } from 'next/navigation';

interface UnderConstructionProps {
  pageName: string;
}

const UnderConstruction = ({ pageName }: UnderConstructionProps) => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <Wrench className={`${styles.icon} ${styles.wrench}`} size={40} />
          <ConstructionIcon className={`${styles.icon} ${styles.construction}`} size={50} />
          <Hammer className={`${styles.icon} ${styles.hammer}`} size={40} />
        </div>
        
        <h1 className={styles.title}>Under Construction</h1>
        <p className={styles.description}>
          The <span className={styles.highlight}>{pageName}</span> section is currently being developed. 
          Our team is working hard to bring you an amazing experience soon!
        </p>

        <button 
          className={styles.button} 
          onClick={() => router.push('/')}
        >
          <RotateCcw size={18} />
          <span>Back to Dashboard</span>
        </button>
      </div>
    </div>
  );
};

export default UnderConstruction; 