'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import CategoriesTable from './components/CategoriesTable';
import CategoryForm from './components/CategoryForm';
import DeleteConfirmation from '../products/components/DeleteConfirmation';
import Modal from '../components/Modal';
import styles from './categories.module.scss';
import { getCategories, createCategory, updateCategory, deleteCategory, Category } from '../services/categoryApi';

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handlers for CRUD operations
  const handleAddCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      setLoading(true);
      console.log('Adding category:', categoryData);
      
      const result = await createCategory(categoryData);
      if (result) {
        fetchCategories();
      }
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category. Please try again later.');
    } finally {
      setLoading(false);
      setIsAddModalOpen(false);
    }
  };

  const handleEditCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      setLoading(true);
      if (selectedCategory) {
        console.log('Updating category:', { id: selectedCategory.id, ...categoryData });
        
        const result = await updateCategory(selectedCategory.id, categoryData);
        if (result) {
          fetchCategories();
        }
      }
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Failed to update category. Please try again later.');
    } finally {
      setLoading(false);
      setIsEditModalOpen(false);
      setSelectedCategory(null);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      setLoading(true);
      if (selectedCategory) {
        const success = await deleteCategory(selectedCategory.id);
        if (success) {
          fetchCategories();
        }
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category. Please try again later.');
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    }
  };

  // Open modals
  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  // Load initial data
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <DashboardLayout>
      <div className={styles.categoriesPage}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Categories</h1>
            <button 
              className={styles.addButton}
              onClick={() => setIsAddModalOpen(true)}
            >
              <span>+</span> Add Category
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && !error ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading categories...</p>
          </div>
        ) : (
          <>
            {/* Categories Table */}
            <div className={styles.tableContainer}>
              <CategoriesTable
                categories={categories}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            </div>
          </>
        )}

        {/* Add Category Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Category"
        >
          <CategoryForm
            onSave={handleAddCategory}
            onCancel={() => setIsAddModalOpen(false)}
            isSubmitting={loading}
          />
        </Modal>

        {/* Edit Category Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCategory(null);
          }}
          title="Edit Category"
        >
          {selectedCategory && (
            <CategoryForm
              category={selectedCategory}
              onSave={handleEditCategory}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedCategory(null);
              }}
              isSubmitting={loading}
            />
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedCategory(null);
          }}
          title="Confirm Delete"
          size="small"
        >
          {selectedCategory && (
            <DeleteConfirmation
              productName={selectedCategory.name}
              onDelete={handleDeleteCategory}
              onCancel={() => {
                setIsDeleteModalOpen(false);
                setSelectedCategory(null);
              }}
            />
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default CategoriesPage; 