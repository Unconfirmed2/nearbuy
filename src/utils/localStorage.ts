export interface BasketItem {
  sku: string;
  storeId: string;
  productName: string;
  storeName: string;
  price: number;
  quantity?: number;
}

export interface FavoriteItem {
  sku: string;
  productName: string;
  image: string;
  addedAt?: string;
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
      (existing) => existing.sku === item.sku && existing.storeId === item.storeId
    );
    if (existingIndex >= 0) {
      basket[existingIndex].quantity = (basket[existingIndex].quantity || 1) + 1;
    } else {
      basket.push({ ...item, quantity: 1 });
    }
    localStorage.setItem('nearbuy_basket', JSON.stringify(basket));
  } catch (error) {
    console.error('Error saving to basket:', error);
  }
};

export const removeFromBasket = (sku: string, storeId: string): void => {
  try {
    const basket = getBasket();
    const filteredBasket = basket.filter(
      (item) => !(item.sku === sku && item.storeId === storeId)
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

export const addToFavorites = (item: FavoriteItem): void => {
  try {
    const favorites = getFavorites();
    const exists = favorites.some((fav) => fav.sku === item.sku);
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

export const removeFromFavorites = (sku: string): void => {
  try {
    const favorites = getFavorites();
    const filteredFavorites = favorites.filter((item) => item.sku !== sku);
    localStorage.setItem('nearbuy_favorites', JSON.stringify(filteredFavorites));
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
};

export const isFavorite = (sku: string): boolean => {
  const favorites = getFavorites();
  return favorites.some((fav) => fav.sku === sku);
};
