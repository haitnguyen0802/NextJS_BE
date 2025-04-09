import styles from './DeleteConfirmation.module.scss';

interface DeleteConfirmationProps {
  onDelete: () => void;
  onCancel: () => void;
  productName: string;
}

const DeleteConfirmation = ({ onDelete, onCancel, productName }: DeleteConfirmationProps) => {
  return (
    <div className={styles.confirmationContainer}>
      <div className={styles.iconWrapper}>
        <svg className={styles.icon} width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 9v3.75M12 17.25h.008M3.75 12h16.5M5.25 19.5h13.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v12a1.5 1.5 0 001.5 1.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      <h3 className={styles.title}>Delete Product</h3>
      
      <p className={styles.message}>
        Are you sure you want to delete <span className={styles.highlight}>{productName}</span>? This action cannot be undone and all data associated with this product will be permanently removed.
      </p>
      
      <div className={styles.actions}>
        <button className={styles.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button className={styles.deleteButton} onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmation; 