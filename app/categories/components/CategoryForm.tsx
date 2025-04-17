import React, { useState, useEffect } from 'react';
import styles from './CategoryForm.module.scss';
import { Category as CategoryModel } from '../../services/categoryApi';

// API request structure for Category
export interface CategoryApiRequest {
  ten_loai: string;
  slug?: string | null;
  thu_tu: number;
  an_hien: number;
}

interface CategoryFormProps {
  category?: CategoryModel;
  onSave: (category: Omit<CategoryModel, 'id'>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

// Default values for a new category
const defaultCategory: Omit<CategoryModel, 'id'> = {
  name: '',
  slug: '',
  order: 0,
  active: true
};

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSave,
  onCancel,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<Omit<CategoryModel, 'id'>>({ ...defaultCategory });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug || '',
        order: category.order,
        active: category.active
      });
    }
  }, [category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : newValue
    });
    
    // Clear error when user makes changes
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    if (formData.order < 0) {
      newErrors.order = 'Display order must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Category Name*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? styles.inputError : ''}
            disabled={isSubmitting}
          />
          {errors.name && <div className={styles.errorMessage}>{errors.name}</div>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="slug">Slug</label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug || ''}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          <br/>
          <small>Leave empty to auto-generate from name</small>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="order">Display Order*</label>
          <input
            type="number"
            id="order"
            name="order"
            value={formData.order}
            onChange={handleChange}
            className={errors.order ? styles.inputError : ''}
            disabled={isSubmitting}
            min="0"
          />
          {errors.order && <div className={styles.errorMessage}>{errors.order}</div>}
        </div>
        
        <div className={styles.formGroup}>
          <div className={styles.checkboxWrapper}>
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <label htmlFor="active">Active</label>
          </div>
        </div>
      </div>
      
      <div className={styles.formActions}>
        <button 
          type="button" 
          className={styles.cancelButton} 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (category ? 'Update Category' : 'Add Category')}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm; 