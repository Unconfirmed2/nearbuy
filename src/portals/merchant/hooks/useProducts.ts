
import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  description?: string;
  brand?: string;
  category_id?: string;
  image_url?: string;
  price: number;
  quantity: number;
  is_active: boolean;
  merchant_id: string;
  created_at: string;
  updated_at: string;
  sku?: string;
  tags?: string[];
  variants?: any[];
}

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
            image_url: '/placeholder.svg',
            price: 999.99,
            quantity: 25,
            is_active: true,
            merchant_id: merchantId,
            created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
            sku: 'IPHONE15PRO-128',
            tags: ['smartphone', 'apple', 'premium']
          },
          {
            id: 'product-2',
            name: 'Samsung Galaxy Book',
            description: 'Powerful laptop for productivity',
            brand: 'Samsung',
            category_id: 'electronics',
            image_url: '/placeholder.svg',
            price: 1299.99,
            quantity: 8,
            is_active: true,
            merchant_id: merchantId,
            created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
            sku: 'GALAXYBOOK-16-512',
            tags: ['laptop', 'samsung', 'productivity']
          },
          {
            id: 'product-3',
            name: 'Wireless Earbuds',
            description: 'High-quality wireless earbuds with noise cancellation',
            brand: 'TechBrand',
            category_id: 'electronics',
            image_url: '/placeholder.svg',
            price: 199.99,
            quantity: 50,
            is_active: true,
            merchant_id: merchantId,
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
            sku: 'EARBUDS-WL-BLK',
            tags: ['earbuds', 'wireless', 'audio']
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
        description: productData.description,
        brand: productData.brand,
        category_id: productData.category_id,
        image_url: productData.image_url || '/placeholder.svg',
        price: productData.price || 0,
        quantity: productData.quantity || 0,
        is_active: productData.is_active ?? true,
        merchant_id: merchantId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sku: productData.sku,
        tags: productData.tags || [],
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
