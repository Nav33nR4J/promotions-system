/**
 * Menu items data for custom promotions
 * This can be replaced with API call to fetch menu from backend
 */

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category?: string;
}

export const menuItems: MenuItem[] = [
  // Burgers
  { id: "burger_1", name: "Classic Burger", price: 199, category: "Burgers" },
  { id: "burger_2", name: "Cheese Burger", price: 249, category: "Burgers" },
  { id: "burger_3", name: "Chicken Burger", price: 229, category: "Burgers" },
  { id: "burger_4", name: "Veggie Burger", price: 179, category: "Burgers" },
  { id: "burger_5", name: "Bacon Burger", price: 299, category: "Burgers" },
  
  // Pizzas
  { id: "pizza_1", name: "Margherita Pizza", price: 349, category: "Pizzas" },
  { id: "pizza_2", name: "Pepperoni Pizza", price: 399, category: "Pizzas" },
  { id: "pizza_3", name: "Chicken Pizza", price: 429, category: "Pizzas" },
  { id: "pizza_4", name: "Veggie Pizza", price: 319, category: "Pizzas" },
  
  // Beverages
  { id: "bev_1", name: "Cola (Regular)", price: 49, category: "Beverages" },
  { id: "bev_2", name: "Cola (Large)", price: 79, category: "Beverages" },
  { id: "bev_3", name: "Lemonade", price: 89, category: "Beverages" },
  { id: "bev_4", name: "Coffee", price: 99, category: "Beverages" },
  { id: "bev_5", name: "Tea", price: 59, category: "Beverages" },
  
  // Snacks
  { id: "snack_1", name: "French Fries (Regular)", price: 99, category: "Snacks" },
  { id: "snack_2", name: "French Fries (Large)", price: 149, category: "Snacks" },
  { id: "snack_3", name: "Onion Rings", price: 129, category: "Snacks" },
  { id: "snack_4", name: "Chicken Wings (6 pcs)", price: 249, category: "Snacks" },
  { id: "snack_5", name: "Mozzarella Sticks", price: 179, category: "Snacks" },
  
  // Desserts
  { id: "dessert_1", name: "Chocolate Ice Cream", price: 99, category: "Desserts" },
  { id: "dessert_2", name: "Vanilla Ice Cream", price: 89, category: "Desserts" },
  { id: "dessert_3", name: "Chocolate Lava Cake", price: 149, category: "Desserts" },
  { id: "dessert_4", name: "Brownie", price: 119, category: "Desserts" },
  
  // Combos
  { id: "combo_1", name: "Burger + Fries + Cola", price: 399, category: "Combos" },
  { id: "combo_2", name: "Pizza + Cola", price: 449, category: "Combos" },
  { id: "combo_3", name: "Burger + Drink", price: 279, category: "Combos" },
];

/**
 * Get menu items by category
 */
export const getMenuItemsByCategory = (): Record<string, MenuItem[]> => {
  const grouped: Record<string, MenuItem[]> = {};
  
  menuItems.forEach((item) => {
    const category = item.category || "Other";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(item);
  });
  
  return grouped;
};

/**
 * Find menu item by ID
 */
export const findMenuItemById = (id: string): MenuItem | undefined => {
  return menuItems.find((item) => item.id === id);
};

/**
 * Find menu items by IDs
 */
export const findMenuItemsByIds = (ids: string[]): MenuItem[] => {
  return menuItems.filter((item) => ids.includes(item.id));
};

