// API Services for Products

interface ProductResponse {
  id: number;
  ten_sp: string;
  slug: string;
  gia: number;
  gia_km: number;
  id_loai: number;
  ngay: string;
  hinh: string;
  hot: number;
  luot_xem: number;
  an_hien: number;
  tinh_chat: number;
  mo_ta: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

interface ProductRequest {
  ten_sp: string;
  gia: number;
  gia_km: number;
  id_loai: number;
  hinh: string;
  hot?: number;
  an_hien?: number;
  tinh_chat?: number;
}

interface CategoryResponse {
  id: number;
  ten_loai: string;
  slug: string | null;
  thu_tu: number;
  an_hien: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  salePrice: number;
  categoryId: number;
  date: string;
  image: string;
  hot: boolean;
  views: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  conditionType: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string | null;
  order: number;
  active: boolean;
}

const API_URL = 'https://fpl.timefortea.io.vn/api/products';

// Helper function to convert API response to our Product model
export const mapApiResponseToProduct = (product: ProductResponse): Product => {
  // Determine status based on an_hien value
  let status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  if (product.an_hien === 0) {
    status = 'Out of Stock';
  } else if (product.tinh_chat === 2) {
    status = 'Low Stock';
  } else {
    status = 'In Stock';
  }

  return {
    id: product.id,
    name: product.ten_sp,
    price: product.gia,
    salePrice: product.gia_km,
    categoryId: product.id_loai,
    date: product.ngay,
    image: product.hinh,
    hot: product.hot === 1,
    views: product.luot_xem,
    status,
    conditionType: product.tinh_chat
  };
};

// Convert our Product model back to API format for creating/updating
export const mapProductToApiRequest = (product: Partial<Product>): ProductRequest => {
  return {
    ten_sp: product.name || '',
    gia: product.price || 0,
    gia_km: product.salePrice || 0,
    id_loai: product.categoryId || 1,
    hinh: product.image || '',
    hot: product.hot ? 1 : 0,
    an_hien: product.status === 'Out of Stock' ? 0 : 1,
    tinh_chat: product.status === 'Low Stock' ? 2 : 0
  };
};

// API Product Request interface that matches the expected API structure
export interface ApiProductRequest {
  ten_sp: string;
  slug?: string;
  gia: number;
  gia_km: number;
  id_loai: number;
  ngay?: string;
  hinh: string;
  hot?: number;
  luot_xem?: number;
  an_hien?: number;
  tinh_chat?: number;
  mo_ta?: string;
  created_at?: string;
}

// Fetch all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data: ProductResponse[] = await response.json();
    return data.map(mapApiResponseToProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Fetch a single product by ID
export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    const data: ProductResponse = await response.json();
    return mapApiResponseToProduct(data);
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return null;
  }
};

// Create a new product
export const createProduct = async (productData: ApiProductRequest): Promise<Product | null> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    
    const data: ProductResponse = await response.json();
    return mapApiResponseToProduct(data);
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

// Update an existing product
export const updateProduct = async (id: number, productData: ApiProductRequest): Promise<Product | null> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update product');
    }
    
    const data: ProductResponse = await response.json();
    return mapApiResponseToProduct(data);
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    return null;
  }
};

// Delete a product
export const deleteProduct = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    
    return response.ok;
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    return false;
  }
};

// Fetch all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch('https://fpl.timefortea.io.vn/api/categories');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data: CategoryResponse[] = await response.json();
    return data.map(category => ({
      id: category.id,
      name: category.ten_loai,
      slug: category.slug,
      order: category.thu_tu,
      active: category.an_hien === 1
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}; 