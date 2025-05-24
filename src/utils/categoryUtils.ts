
// Categories with their display names and colors
export const categoryInfo: Record<string, { title: string, color: string, bgColor: string }> = {
  'senior-living': { 
    title: 'Senior Living', 
    color: 'bg-gradient-to-r from-rose-400 to-pink-500',
    bgColor: 'bg-rose-50' 
  },
  'home-care': { 
    title: 'Home Care', 
    color: 'bg-gradient-to-r from-blue-400 to-blue-500',
    bgColor: 'bg-blue-50' 
  },
  'government': { 
    title: 'Government', 
    color: 'bg-gradient-to-r from-emerald-400 to-emerald-500',
    bgColor: 'bg-emerald-50' 
  },
  'attorneys': { 
    title: 'Attorneys', 
    color: 'bg-gradient-to-r from-amber-400 to-orange-500',
    bgColor: 'bg-amber-50' 
  },
  'other-professionals': { 
    title: 'Other Professionals', 
    color: 'bg-gradient-to-r from-indigo-400 to-indigo-500',
    bgColor: 'bg-indigo-50' 
  },
  'va': { 
    title: 'VA', 
    color: 'bg-gradient-to-r from-teal-400 to-teal-500',
    bgColor: 'bg-teal-50' 
  },
  'physical-therapy': { 
    title: 'Physical Therapy', 
    color: 'bg-gradient-to-r from-cyan-400 to-cyan-500',
    bgColor: 'bg-cyan-50' 
  },
  'paying-for-care': { 
    title: 'Paying for Care', 
    color: 'bg-gradient-to-r from-lime-400 to-lime-500',
    bgColor: 'bg-lime-50' 
  }
};

// Custom categories stored in localStorage
const CUSTOM_CATEGORIES_KEY = 'custom-email-categories';

interface CustomCategory {
  id: string;
  title: string;
  color: string;
  bgColor: string;
}

// Get custom categories from localStorage
export const getCustomCategories = (): CustomCategory[] => {
  try {
    const stored = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save custom categories to localStorage
export const saveCustomCategories = (categories: CustomCategory[]): void => {
  try {
    localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(categories));
  } catch {
    // Handle storage errors silently
  }
};

// Add a new custom category
export const addCustomCategory = (title: string): CustomCategory => {
  const customCategories = getCustomCategories();
  const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  // Generate a random color from available options
  const colorOptions = [
    { color: 'bg-gradient-to-r from-purple-400 to-purple-500', bgColor: 'bg-purple-50' },
    { color: 'bg-gradient-to-r from-pink-400 to-pink-500', bgColor: 'bg-pink-50' },
    { color: 'bg-gradient-to-r from-red-400 to-red-500', bgColor: 'bg-red-50' },
    { color: 'bg-gradient-to-r from-orange-400 to-orange-500', bgColor: 'bg-orange-50' },
    { color: 'bg-gradient-to-r from-yellow-400 to-yellow-500', bgColor: 'bg-yellow-50' },
    { color: 'bg-gradient-to-r from-green-400 to-green-500', bgColor: 'bg-green-50' },
    { color: 'bg-gradient-to-r from-slate-400 to-slate-500', bgColor: 'bg-slate-50' },
  ];
  
  const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
  
  const newCategory: CustomCategory = {
    id,
    title,
    ...randomColor
  };
  
  const updatedCategories = [...customCategories, newCategory];
  saveCustomCategories(updatedCategories);
  
  return newCategory;
};

// Get all categories (predefined + custom)
export const getAllCategories = (): Record<string, { title: string, color: string, bgColor: string }> => {
  const customCategories = getCustomCategories();
  const customCategoryInfo = customCategories.reduce((acc, category) => {
    acc[category.id] = {
      title: category.title,
      color: category.color,
      bgColor: category.bgColor
    };
    return acc;
  }, {} as Record<string, { title: string, color: string, bgColor: string }>);
  
  return { ...categoryInfo, ...customCategoryInfo };
};

// Check if a category exists
export const categoryExists = (categoryId: string): boolean => {
  const allCategories = getAllCategories();
  return categoryId in allCategories;
};
