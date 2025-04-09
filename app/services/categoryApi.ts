// API Services for Categories

interface CategoryResponse {
  id: number;
  ten_loai: string;
  slug: string | null;
  thu_tu: number;
  an_hien: number;
  created_at: string | null;
  updated_at: string | null;
}

interface CategoryRequest {
  ten_loai: string;
  slug?: string | null;
  thu_tu: number;
  an_hien: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string | null;
  order: number;
  active: boolean;
}

const API_URL = 'https://fpl.timefortea.io.vn/api/categories';

// Helper function to convert API response to our Category model
export const mapApiResponseToCategory = (category: CategoryResponse): Category => {
  return {
    id: category.id,
    name: category.ten_loai,
    slug: category.slug,
    order: category.thu_tu,
    active: category.an_hien === 1
  };
};

// Convert our Category model back to API format for creating/updating
export const mapCategoryToApiRequest = (category: Partial<Category>): CategoryRequest => {
  return {
    ten_loai: category.name || '',
    slug: category.slug || null,
    thu_tu: category.order || 0,
    an_hien: category.active ? 1 : 0
  };
};

// Fetch all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data: CategoryResponse[] = await response.json();
    return data.map(mapApiResponseToCategory);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Fetch a single category by ID
export const getCategoryById = async (id: number): Promise<Category | null> => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch category');
    }
    const data: CategoryResponse = await response.json();
    return mapApiResponseToCategory(data);
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error);
    return null;
  }
};

// Create a new category
export const createCategory = async (category: Omit<Category, 'id'>): Promise<Category | null> => {
  try {
    const categoryData = mapCategoryToApiRequest(category);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create category');
    }
    
    const data: CategoryResponse = await response.json();
    return mapApiResponseToCategory(data);
  } catch (error) {
    console.error('Error creating category:', error);
    return null;
  }
};

// Update an existing category
export const updateCategory = async (id: number, category: Partial<Category>): Promise<Category | null> => {
  try {
    const categoryData = mapCategoryToApiRequest(category);
    const response = await fetch(`${API_URL}/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update category');
    }
    
    const data: CategoryResponse = await response.json();
    return mapApiResponseToCategory(data);
  } catch (error) {
    console.error(`Error updating category with id ${id}:`, error);
    return null;
  }
};

// Delete a category
export const deleteCategory = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/delete/${id}`, {
      method: 'DELETE',
    });
    
    return response.ok;
  } catch (error) {
    console.error(`Error deleting category with id ${id}:`, error);
    return false;
  }
}; 