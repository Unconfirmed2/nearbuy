
export interface BasketItem {
  productId: number;
  storeId: number;
  productName: string;
  storeName: string;
  price: number;
  quantity?: number;
}

export interface FavoriteItem {
  productId: number;
  productName: string;
  image: string;
  addedAt: string;
}

// Basket management
export const getBasket = (): BasketItem[] => {
  try {
    const basket = localStorage.getItem('nearbuy_basket');
    return basket ? JSON.parse(basket) : [];
  } catch (error) {
    console.error('Error reading basket from localStorage:', error);
    return [];
  }
};

export const addToBasket = (item: BasketItem): void => {
  try {
    const basket = getBasket();
    const existingIndex = basket.findIndex(
      (existing) => existing.productId === item.productId && existing.storeId === item.storeId
    );
    
    if (existingIndex >= 0) {
      // Update quantity if item already exists
      basket[existingIndex].quantity = (basket[existingIndex].quantity || 1) + 1;
    } else {
      // Add new item with quantity 1
      basket.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem('nearbuy_basket', JSON.stringify(basket));
  } catch (error) {
    console.error('Error saving to basket:', error);
  }
};

export const removeFromBasket = (productId: number, storeId: number): void => {
  try {
    const basket = getBasket();
    const filteredBasket = basket.filter(
      (item) => !(item.productId === productId && item.storeId === storeId)
    );
    localStorage.setItem('nearbuy_basket', JSON.stringify(filteredBasket));
  } catch (error) {
    console.error('Error removing from basket:', error);
  }
};

export const clearBasket = (): void => {
  try {
    localStorage.removeItem('nearbuy_basket');
  } catch (error) {
    console.error('Error clearing basket:', error);
  }
};

// Favorites management
export const getFavorites = (): FavoriteItem[] => {
  try {
    const favorites = localStorage.getItem('nearbuy_favorites');
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error);
    return [];
  }
};

export const addToFavorites = (item: Omit<FavoriteItem, 'addedAt'>): void => {
  try {
    const favorites = getFavorites();
    const exists = favorites.some((fav) => fav.productId === item.productId);
    
    if (!exists) {
      const newFavorite: FavoriteItem = {
        ...item,
        addedAt: new Date().toISOString()
      };
      favorites.push(newFavorite);
      localStorage.setItem('nearbuy_favorites', JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
};

export const removeFromFavorites = (productId: number): void => {
  try {
    const favorites = getFavorites();
    const filteredFavorites = favorites.filter((item) => item.productId !== productId);
    localStorage.setItem('nearbuy_favorites', JSON.stringify(filteredFavorites));
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
};

export const isFavorite = (productId: number): boolean => {
  const favorites = getFavorites();
  return favorites.some((fav) => fav.productId === productId);
};
