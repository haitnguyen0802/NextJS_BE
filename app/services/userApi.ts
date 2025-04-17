// Auth Services for Users

interface UserResponse {
  id: number;
  email: string;
  mat_khau: string;
  ho_ten: string;
  dia_chi: string;
  dien_thoai: string;
  vai_tro: number;
  khoa: number;
  hinh: string;
  email_verified_at: string | null;
  remember_token: string | null;
  created_at: string | null;
}

export interface User {
  id: number;
  email: string;
  name: string;
  address: string;
  phone: string;
  role: number;
  isLocked: boolean;
  avatar: string;
}

export interface CreateUserRequest {
  email: string;
  mat_khau: string;
  ho_ten: string;
  dia_chi: string;
  dien_thoai: string;
  vai_tro: number;
  khoa: number;
  hinh: string;
}

export interface UpdateUserRequest {
  email?: string;
  mat_khau?: string;
  ho_ten?: string;
  dia_chi?: string;
  dien_thoai?: string;
  vai_tro?: number;
  khoa?: number;
  hinh?: string;
}

// API endpoint for users
const API_URL = 'https://fpl.timefortea.io.vn/api/users';

// Helper function to convert API response to our User model
export const mapApiResponseToUser = (user: UserResponse): User => {
  return {
    id: user.id,
    email: user.email,
    name: user.ho_ten,
    address: user.dia_chi,
    phone: user.dien_thoai,
    role: user.vai_tro,
    isLocked: user.khoa === 1,
    avatar: user.hinh
  };
};

// For login, create a separate interface
export interface LoginCredentials {
  identifier: string; // Can be email or phone
  password: string;
}

// Login function - this is a mock implementation for demonstration
// In a real app, you'd call the actual API endpoint
export const login = async (credentials: LoginCredentials): Promise<User | null> => {
  try {
    // We'll simulate a login by fetching user data from a specific ID
    // In a real app, you would make a POST request to a login endpoint
    const response = await fetch(`${API_URL}/1`);
    
    if (!response.ok) {
      throw new Error('Failed to login');
    }
    
    const userData: UserResponse = await response.json();
    
    // Check if email or phone matches
    const identifierMatches = 
      userData.email === credentials.identifier || 
      userData.dien_thoai === credentials.identifier;
    
    // For demo, we'll check if password is '123456' as mentioned in requirements
    // In a real app, you'd never do this - the API should handle password verification
    const passwordMatches = credentials.password === '123456';
    
    if (identifierMatches && passwordMatches) {
      // User found and credentials match
      const user = mapApiResponseToUser(userData);
      // Store user in localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    
    return null;
  } catch (error) {
    console.error('Error during login:', error);
    return null;
  }
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem('currentUser');
};

// Check if user is logged in
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') {
    return null; // Running on server
  }
  
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
};

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    const usersData: UserResponse[] = await response.json();
    return usersData.map(mapApiResponseToUser);
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Get user by ID
export const getUserById = async (id: number): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    
    const userData: UserResponse = await response.json();
    return mapApiResponseToUser(userData);
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error);
    return null;
  }
};

// Create a new user
export const createUser = async (userData: CreateUserRequest): Promise<User | null> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    
    const newUserData: UserResponse = await response.json();
    return mapApiResponseToUser(newUserData);
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

// Update an existing user
export const updateUser = async (id: number, userData: UpdateUserRequest): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update user with id ${id}`);
    }
    
    const updatedUserData: UserResponse = await response.json();
    return mapApiResponseToUser(updatedUserData);
  } catch (error) {
    console.error(`Error updating user with id ${id}:`, error);
    return null;
  }
};

// Delete a user
export const deleteUser = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete user with id ${id}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting user with id ${id}:`, error);
    return false;
  }
}; 