import { useState, useEffect } from 'react';
import styles from './ProductForm.module.scss';
import { ApiProductRequest } from '../../services/api';

// Define the UI product interface (for display purposes)
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  categoryId: number;
  image: string;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

interface ProductFormProps {
  product?: Product;
  onSubmit: (productData: ApiProductRequest) => void;
  onCancel: () => void;
  categories?: { id: number; name: string }[];
}

// Default values for a new product
const defaultProduct: Omit<Product, 'id'> = {
  name: '',
  price: 0,
  category: '',
  categoryId: 1,
  image: '/products/placeholder.jpg',
  stock: 0,
  status: 'In Stock'
};

const ProductForm = ({ product, onSubmit, onCancel, categories = [] }: ProductFormProps) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'> & { id?: number }>(
    product || { ...defaultProduct, category: categories[0]?.name || defaultProduct.category, categoryId: categories[0]?.id || 1 }
  );
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const statuses = ['In Stock', 'Low Stock', 'Out of Stock'];

  useEffect(() => {
    if (product) {
      setFormData(product);
      setImagePreview(product.image);
    } else if (categories.length > 0 && !formData.category) {
      setFormData(prev => ({
        ...prev,
        category: categories[0].name,
        categoryId: categories[0].id
      }));
    }
  }, [product, categories, formData.category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let processedValue: string | number = value;
    
    // Convert numeric fields
    if (name === 'price' || name === 'salePrice' || name === 'stock') {
      processedValue = Number(value) || 0;
    }

    // Handle category selection
    if (name === 'category') {
      const selectedCategory = categories.find(cat => cat.name === value);
      if (selectedCategory) {
        setFormData(prev => ({
          ...prev,
          category: value,
          categoryId: selectedCategory.id
        }));
        return;
      }
    }
    
    // For other fields
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server
      // For now, we create a temporary URL for preview
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setFormData(prev => ({
        ...prev,
        image: file.name // Assume filename will be used as path
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Map UI product to API format
  const mapToApiRequest = (): ApiProductRequest => {
    // Calculate an_hien value based on status
    let anHien = 1; // Default to visible
    if (formData.status === 'Out of Stock') {
      anHien = 0;
    }

    // Calculate tinh_chat value based on status
    let tinhChat = 0; // Default
    if (formData.status === 'Low Stock') {
      tinhChat = 2;
    }

    return {
      ten_sp: formData.name,
      gia: formData.price,
      gia_km: Math.round(formData.price * 0.9), // Set discounted price to 90% of original price by default
      id_loai: formData.categoryId,
      hinh: formData.image,
      hot: 0, // Default not hot
      luot_xem: 0, // Default views
      an_hien: anHien,
      tinh_chat: tinhChat,
      mo_ta: description || undefined
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const apiProduct = mapToApiRequest();
      onSubmit(apiProduct);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className={errors.name ? styles.inputError : ''}
          />
          {errors.name && <p className={styles.errorText}>{errors.name}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {categories.map(category => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price">Original Price (VND)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="1000"
            min="0"
            className={errors.price ? styles.inputError : ''}
          />
          {errors.price && <p className={styles.errorText}>{errors.price}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image">Product Image</label>
          <div className={styles.imageUpload}>
            {imagePreview && (
              <div className={styles.imagePreview}>
                <img src={imagePreview} alt="Product Preview" />
              </div>
            )}
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>
        </div>
        
        <div className={styles.formGroup + ' ' + styles.fullWidth}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Enter product description"
            rows={4}
          />
        </div>
      </div>

      <div className={styles.formActions}>
        <button 
          type="button" 
          className={styles.cancelButton}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className={styles.submitButton}
        >
          {product ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm; 