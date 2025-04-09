export { default as ProductsTable } from './ProductsTable';
export { default as ProductForm } from './ProductForm';
export { default as DeleteConfirmation } from './DeleteConfirmation';

// Define common types for the products module
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  categoryId: number;
  image: string;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
} 