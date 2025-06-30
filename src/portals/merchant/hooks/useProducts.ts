
import { useState, useEffect } from 'react';
import { Product, InventoryItem } from '../types/product';

export const useProducts = (merchantId: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockProducts: Product[] = [
          {
            id: 'product-1',
            name: 'iPhone 15 Pro',
            description: 'Latest iPhone with advanced features',
            brand: 'Apple',
            category_id: 'electronics',
            sku: 'IPHONE15PRO-128',
            price: 999.99,
            images: ['/placeholder.svg'],
            tags: ['smartphone', 'apple', 'premium'],
            is_active: true,
            track_inventory: true,
            store_id: 'store-1',
            created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
            inventory: [{
              id: 'inv-1',
              product_id: 'product-1',
              store_id: 'store-1',
              quantity: 25,
              reserved_quantity: 0,
              low_stock_threshold: 5,
              track_quantity: true,
              updated_at: new Date().toISOString()
            }]
          },
          {
            id: 'product-2',
            name: 'Samsung Galaxy Book',
            description: 'Powerful laptop for productivity',
            brand: 'Samsung',
            category_id: 'electronics',
            sku: 'GALAXYBOOK-16-512',
            price: 1299.99,
            images: ['/placeholder.svg'],
            tags: ['laptop', 'samsung', 'productivity'],
            is_active: true,
            track_inventory: true,
            store_id: 'store-1',
            created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
            inventory: [{
              id: 'inv-2',
              product_id: 'product-2',
              store_id: 'store-1',
              quantity: 8,
              reserved_quantity: 0,
              low_stock_threshold: 3,
              track_quantity: true,
              updated_at: new Date().toISOString()
            }]
          },
          {
            id: 'product-3',
            name: 'Wireless Earbuds',
            description: 'High-quality wireless earbuds with noise cancellation',
            brand: 'TechBrand',
            category_id: 'electronics',
            sku: 'EARBUDS-WL-BLK',
            price: 199.99,
            images: ['/placeholder.svg'],
            tags: ['earbuds', 'wireless', 'audio'],
            is_active: true,
            track_inventory: true,
            store_id: 'store-1',
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
            inventory: [{
              id: 'inv-3',
              product_id: 'product-3',
              store_id: 'store-1',
              quantity: 50,
              reserved_quantity: 0,
              low_stock_threshold: 10,
              track_quantity: true,
              updated_at: new Date().toISOString()
            }]
          }
        ];
        
        setProducts(mockProducts);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    if (merchantId) {
      fetchProducts();
    }
  }, [merchantId]);

  const createProduct = async (productData: Partial<Product>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newProduct: Product = {
        id: `product-${Date.now()}`,
        name: productData.name || '',
        description: productData.description || '',
        brand: productData.brand || '',
        category_id: productData.category_id || '',
        sku: productData.sku || '',
        price: productData.price || 0,
        images: productData.images || ['/placeholder.svg'],
        tags: productData.tags || [],
        is_active: productData.is_active ?? true,
        track_inventory: productData.track_inventory ?? true,
        store_id: productData.store_id || 'store-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: productData.metadata,
        variants: productData.variants || []
      };
      
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      console.error('Error creating product:', err);
      throw new Error('Failed to create product');
    }
  };

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProducts(prev => 
        prev.map(product => 
          product.id === productId 
            ? { ...product, ...updates, updated_at: new Date().toISOString() }
            : product
        )
      );
    } catch (err) {
      console.error('Error updating product:', err);
      throw new Error('Failed to update product');
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProducts(prev => prev.filter(product => product.id !== productId));
    } catch (err) {
      console.error('Error deleting product:', err);
      throw new Error('Failed to delete product');
    }
  };

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: () => {
      setLoading(true);
      setProducts([]);
    }
  };
};
