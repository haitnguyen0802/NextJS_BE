import { useState } from 'react';
import Image from 'next/image';
import styles from './ProductsTable.module.scss';

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

interface ProductsTableProps {
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  products: Product[];
}

const ProductsTable = ({ onEdit, onDelete, products }: ProductsTableProps) => {
  const [sortColumn, setSortColumn] = useState('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // No need to filter products here as they're already filtered at the page level
  // Just sort the products
  const sortedProducts = [...products].sort((a, b) => {
    let comparison = 0;
    
    if (sortColumn === 'id') {
      comparison = a.id - b.id;
    } else if (sortColumn === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortColumn === 'category') {
      comparison = a.category.localeCompare(b.category);
    } else if (sortColumn === 'price') {
      comparison = a.price - b.price;
    } else if (sortColumn === 'stock') {
      comparison = a.stock - b.stock;
    } else if (sortColumn === 'status') {
      comparison = a.status.localeCompare(b.status);
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'In Stock':
        return styles.statusInStock;
      case 'Low Stock':
        return styles.statusLowStock;
      case 'Out of Stock':
        return styles.statusOutOfStock;
      default:
        return '';
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) return null;
    
    return (
      <span className={styles.sortIcon}>
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  // Hiển thị thông báo nếu không có sản phẩm nào
  if (sortedProducts.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6.25h18M8 6.25V5.5a2 2 0 012-2h4a2 2 0 012 2v.75M18 6.25v12.5a1.75 1.75 0 01-1.75 1.75H7.75A1.75 1.75 0 016 18.75V6.25m4.5 3.75v7.5m3-7.5v7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>No products found</h3>
        <p>Try adjusting your search or filter to find what you&apos;re looking for.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>
              ID <SortIcon column="id" />
            </th>
            <th onClick={() => handleSort('name')}>
              Product <SortIcon column="name" />
            </th>
            <th onClick={() => handleSort('category')}>
              Category <SortIcon column="category" />
            </th>
            <th onClick={() => handleSort('price')}>
              Price <SortIcon column="price" />
            </th>
            <th onClick={() => handleSort('stock')}>
              Stock <SortIcon column="stock" />
            </th>
            <th onClick={() => handleSort('status')}>
              Status <SortIcon column="status" />
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map((product) => (
            <tr key={product.id}>
              <td>#{product.id}</td>
              <td>
                <div className={styles.productCell}>
                  <div className={styles.productImage}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={40}
                      height={40}
                      className={styles.image}
                      unoptimized
                      onError={(e) => {
                        // Fallback to a default image if the image fails to load
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Prevent infinite loop
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiM0QjU1NjMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI0ZGRiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTBweCI+PzwvdGV4dD48L3N2Zz4=';
                      }}
                    />
                  </div>
                  <span>{product.name}</span>
                </div>
              </td>
              <td>{product.category}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.stock}</td>
              <td>
                <span className={`${styles.statusBadge} ${getStatusClass(product.status)}`}>
                  {product.status}
                </span>
              </td>
              <td>
                <div className={styles.actions}>
                  <button 
                    className={styles.actionButton} 
                    title="View details"
                    onClick={() => console.log('View product details', product.id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button 
                    className={styles.actionButton} 
                    title="Edit"
                    onClick={() => onEdit(product)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button 
                    className={styles.actionButton} 
                    title="Delete"
                    onClick={() => onDelete(product)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable; 