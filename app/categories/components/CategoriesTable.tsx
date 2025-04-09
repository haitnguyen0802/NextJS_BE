import { useState } from 'react';
import styles from './CategoriesTable.module.scss';

export interface Category {
  id: number;
  name: string;
  slug: string | null;
  order: number;
  active: boolean;
}

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const CategoriesTable = ({ categories, onEdit, onDelete }: CategoriesTableProps) => {
  const [sortColumn, setSortColumn] = useState<keyof Category>('order');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sort categories
  const sortedCategories = [...categories].sort((a, b) => {
    let comparison = 0;
    
    if (sortColumn === 'id') {
      comparison = a.id - b.id;
    } else if (sortColumn === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortColumn === 'slug') {
      // Handle null values for slug
      if (a.slug === null && b.slug === null) return 0;
      if (a.slug === null) return 1;
      if (b.slug === null) return -1;
      return a.slug.localeCompare(b.slug);
    } else if (sortColumn === 'order') {
      comparison = a.order - b.order;
    } else if (sortColumn === 'active') {
      comparison = (a.active === b.active) ? 0 : a.active ? -1 : 1;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (column: keyof Category) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ column }: { column: keyof Category }) => {
    if (sortColumn !== column) return null;
    
    return (
      <span className={styles.sortIcon}>
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  // Display a message if no categories are found
  if (sortedCategories.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6.25h18M8 6.25V5.5a2 2 0 012-2h4a2 2 0 012 2v.75M18 6.25v12.5a1.75 1.75 0 01-1.75 1.75H7.75A1.75 1.75 0 016 18.75V6.25m4.5 3.75v7.5m3-7.5v7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>No categories found</h3>
        <p>Click the "Add Category" button to create your first category.</p>
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
              Name <SortIcon column="name" />
            </th>
            <th onClick={() => handleSort('slug')}>
              Slug <SortIcon column="slug" />
            </th>
            <th onClick={() => handleSort('order')}>
              Order <SortIcon column="order" />
            </th>
            <th onClick={() => handleSort('active')}>
              Status <SortIcon column="active" />
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedCategories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>{category.slug || <span className={styles.emptyValue}>—</span>}</td>
              <td>{category.order}</td>
              <td>
                <span className={`${styles.statusBadge} ${category.active ? styles.statusActive : styles.statusInactive}`}>
                  {category.active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                <div className={styles.actions}>
                  <button 
                    className={styles.actionButton} 
                    title="Edit"
                    onClick={() => onEdit(category)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button 
                    className={styles.actionButton} 
                    title="Delete"
                    onClick={() => onDelete(category)}
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

export default CategoriesTable; 