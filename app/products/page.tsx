'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { ProductsTable, ProductForm, DeleteConfirmation, Product } from './components';
import Modal from '../components/Modal';
import styles from './products.module.scss';
import { getProducts, createProduct, updateProduct, deleteProduct, Product as ApiProduct, getCategories, ApiProductRequest } from '../services/api';

// Define the interface for the Product as expected by the ProductsTable
// Use a different name to avoid conflict
interface ProductItem extends Product {
  categoryId: number; // Ensure categoryId is required for our internal use
}

interface CategoryItem {
  id: number;
  name: string;
}

interface CategoryCount {
  [key: string]: number;
}

// Inline Pagination Component
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  onPrevious, 
  onNext 
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}) => {
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // Calculate range around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis if needed before current range
    if (startPage > 2) {
      pageNumbers.push('...');
    }
    
    // Add pages in the middle
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    // Add ellipsis if needed after current range
    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }
    
    // Always show last page if it exists
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div className={styles.pagination}>
      <button 
        className={`${styles.pageButton} ${styles.navButton} ${currentPage === 1 ? styles.disabled : ''}`}
        onClick={onPrevious}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      
      {pageNumbers.map((pageNumber, index) => (
        pageNumber === '...' ? (
          <span key={`ellipsis-${index}`} className={styles.ellipsis}>...</span>
        ) : (
          <button
            key={pageNumber}
            className={`${styles.pageButton} ${pageNumber === currentPage ? styles.active : ''}`}
            onClick={() => typeof pageNumber === 'number' && onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        )
      ))}
      
      <button 
        className={`${styles.pageButton} ${styles.navButton} ${currentPage === totalPages ? styles.disabled : ''}`}
        onClick={onNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

// Map Product from API to the format expected by the ProductsTable
const mapApiProductToTableProduct = (product: ApiProduct, categories: CategoryItem[]): ProductItem => {
  // Check if the image URL is already a full URL or just a relative path
  let imageUrl = product.image;
  if (imageUrl && !imageUrl.startsWith('http')) {
    // If it's a relative path, prepend the API domain
    imageUrl = `https://fpl.timefortea.io.vn${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  }
  
  // Find category name by ID
  const category = categories.find(cat => cat.id === product.categoryId);
  
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    category: category ? category.name : `Category ${product.categoryId}`,
    categoryId: product.categoryId,
    image: imageUrl || '/products/default.jpg', // Use a default image if none provided
    stock: product.conditionType, // Assuming conditionType represents stock
    status: product.status
  };
};

// Function to sanitize search text by removing special characters
const sanitizeSearchText = (text: string): string => {
  return text.toLowerCase()
    .replace(/[^\w\s]/gi, '') // Remove special characters
    .trim();
};

const ProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sanitizedSearchQuery, setSanitizedSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount>({});
  const [totalProductCount, setTotalProductCount] = useState<number>(0);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  
  // State cho modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Fetch products based on selected filters
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories first
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      
      // Then fetch products
      const productsData = await getProducts();
      
      // Map API products to the format expected by the ProductsTable
      const mappedProducts = productsData.map(product => 
        mapApiProductToTableProduct(product, categoriesData)
      );
      
      setProducts(mappedProducts);
      setTotalProductCount(mappedProducts.length);
      
      // Calculate product counts per category
      const counts: CategoryCount = {};
      categoriesData.forEach(category => {
        const count = mappedProducts.filter(product => product.categoryId === category.id).length;
        counts[`category-${category.id}`] = count;
      });
      setCategoryCounts(counts);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Update sanitized search query when search query changes
  useEffect(() => {
    setSanitizedSearchQuery(sanitizeSearchText(searchQuery));
  }, [searchQuery]);

  // Filter products based on search query and category filter
  const filteredProducts = products.filter(product => {
    // Filter by search query
    const sanitizedProductName = sanitizeSearchText(product.name);
    const matchesSearch = sanitizedProductName.includes(sanitizedSearchQuery);
    
    // Filter by category
    let matchesCategory = categoryFilter === 'all';
    if (!matchesCategory && categoryFilter.startsWith('category-')) {
      const categoryId = parseInt(categoryFilter.split('-')[1]);
      matchesCategory = product.categoryId === categoryId;
    }
    
    return matchesSearch && matchesCategory;
  });
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handlers cho các hành động CRUD
  const handleAddProduct = async (productData: ApiProductRequest) => {
    try {
      setLoading(true);
      
      console.log('Submitting product data:', productData);
      
      const result = await createProduct(productData);
      if (result) {
        // Refresh products list
        fetchData();
      }
    } catch (err) {
      console.error('Error adding product:', err);
      setError('Failed to add product. Please try again later.');
    } finally {
      setLoading(false);
      setIsAddModalOpen(false);
    }
  };

  const handleEditProduct = async (productData: ApiProductRequest) => {
    try {
      setLoading(true);
      if (selectedProduct && selectedProduct.id) {
        console.log('Updating product data:', productData);
        
        const result = await updateProduct(selectedProduct.id, productData);
        if (result) {
          // Refresh products list
          fetchData();
        }
      }
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product. Please try again later.');
    } finally {
      setLoading(false);
      setIsEditModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      setLoading(true);
      if (selectedProduct && selectedProduct.id) {
        const success = await deleteProduct(selectedProduct.id);
        if (success) {
          // Refresh products list
          const data = await getProducts();
          setProducts(data.map(p => mapApiProductToTableProduct(p, categories)));
        }
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product. Please try again later.');
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product as ProductItem);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product as ProductItem);
    setIsDeleteModalOpen(true);
  };

  // Filter by category
  const filterByCategory = (categoryId: number | null) => {
    setCategoryFilter(categoryId === null ? 'all' : `category-${categoryId}`);
    setCurrentPage(1);
  };

  // Use effect to load initial data
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className={styles.productsPage}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Products</h1>
            <button 
              className={styles.addButton}
              onClick={() => setIsAddModalOpen(true)}
            >
              <span>+</span> Add Product
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className={styles.filters}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className={styles.searchIcon}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className={styles.categoryFilters}>
            <button
              className={`${styles.categoryButton} ${categoryFilter === 'all' ? styles.active : ''}`}
              onClick={() => filterByCategory(null)}
            >
              All ({totalProductCount})
            </button>
            {categories.map((category) => {
              const categoryCount = categoryCounts[`category-${category.id}`] || 0;
              return (
                <button
                  key={category.id}
                  className={`${styles.categoryButton} ${
                    categoryFilter === `category-${category.id}` ? styles.active : ''
                  }`}
                  onClick={() => filterByCategory(category.id)}
                >
                  {category.name} ({categoryCount})
                </button>
              );
            })}
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
            <p>Loading products...</p>
          </div>
        ) : (
          <>
            {/* Products Table */}
            <div className={styles.tableContainer}>
              <ProductsTable 
                onEdit={openEditModal}
                onDelete={openDeleteModal}
                products={currentItems} // Pass only the current page items
              />
            </div>
            
            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={paginate}
                onPrevious={prevPage}
                onNext={nextPage}
              />
            )}
          </>
        )}

        {/* Add Product Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Product"
        >
          <ProductForm
            onSubmit={handleAddProduct}
            onCancel={() => setIsAddModalOpen(false)}
            categories={categories.map(cat => ({ id: cat.id, name: cat.name }))}
          />
        </Modal>

        {/* Edit Product Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProduct(null);
          }}
          title="Edit Product"
        >
          {selectedProduct && (
            <ProductForm
              product={selectedProduct}
              onSubmit={handleEditProduct}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedProduct(null);
              }}
              categories={categories.map(cat => ({ id: cat.id, name: cat.name }))}
            />
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedProduct(null);
          }}
          title="Confirm Delete"
          size="small"
        >
          {selectedProduct && (
            <DeleteConfirmation
              productName={selectedProduct.name}
              onDelete={handleDeleteProduct}
              onCancel={() => {
                setIsDeleteModalOpen(false);
                setSelectedProduct(null);
              }}
            />
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default ProductsPage; 