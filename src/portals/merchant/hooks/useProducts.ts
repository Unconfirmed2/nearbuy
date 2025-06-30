
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product, CreateProductData, ProductFilters } from '../types/product';
import { toast } from 'sonner';

export const useProducts = (merchantId?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for development
  const mockProducts: Product[] = [
    {
      id: 'prod-1',
      name: 'iPhone 15 Pro Max',
      description: 'Latest iPhone with advanced camera system and titanium design',
      brand: 'Apple',
      category_id: 'cat-1',
      sku: 'IPHONE-15-PRO-MAX-256',
      price: 1199.99,
      cost_price: 800.00,
      compare_at_price: 1299.99,
      images: ['/placeholder.svg', '/placeholder.svg'],
      tags: ['smartphone', 'premium', 'new'],
      is_active: true,
      track_inventory: true,
      store_id: 'store-1',
      metadata: {
        color: 'Titanium Blue',
        weight: 221,
        dimensions: { length: 6.33, width: 3.05, height: 0.32, unit: 'in' },
        warranty: '1 year Apple warranty'
      },
      variants: [
        {
          id: 'var-1',
          product_id: 'prod-1',
          name: '256GB - Titanium Blue',
          sku: 'IPHONE-15-PRO-MAX-256-BLUE',
          price: 1199.99,
          attributes: { storage: '256GB', color: 'Titanium Blue' },
          created_at: '2024-06-20T10:00:00Z',
          updated_at: '2024-06-20T10:00:00Z'
        }
      ],
      inventory: [
        {
          id: 'inv-1',
          product_id: 'prod-1',
          store_id: 'store-1',
          quantity: 15,
          reserved_quantity: 2,
          low_stock_threshold: 5,
          track_quantity: true,
          updated_at: '2024-06-20T15:00:00Z'
        }
      ],
      created_at: '2024-06-15T10:00:00Z',
      updated_at: '2024-06-20T15:00:00Z'
    },
    {
      id: 'prod-2',
      name: 'MacBook Air M3',
      description: 'Incredibly thin and light laptop with M3 chip',
      brand: 'Apple',
      category_id: 'cat-2',
      sku: 'MBA-M3-13-512',
      price: 1499.99,
      cost_price: 1100.00,
      images: ['/placeholder.svg'],
      tags: ['laptop', 'portable', 'productivity'],
      is_active: true,
      track_inventory: true,
      store_id: 'store-1',
      metadata: {
        color: 'Midnight',
        weight: 2.7,
        dimensions: { length: 11.97, width: 8.46, height: 0.44, unit: 'in' }
      },
      inventory: [
        {
          id: 'inv-2',
          product_id: 'prod-2',
          store_id: 'store-1',
          quantity: 3,
          reserved_quantity: 0,
          low_stock_threshold: 5,
          track_quantity: true,
          updated_at: '2024-06-20T15:00:00Z'
        }
      ],
      created_at: '2024-06-10T10:00:00Z',
      updated_at: '2024-06-18T12:00:00Z'
    },
    {
      id: 'prod-3',
      name: 'AirPods Pro (2nd Gen)',
      description: 'Premium wireless earbuds with active noise cancellation',
      brand: 'Apple',
      category_id: 'cat-3',
      sku: 'AIRPODS-PRO-2',
      price: 249.99,
      cost_price: 150.00,
      images: ['/placeholder.svg'],
      tags: ['earbuds', 'wireless', 'noise-cancelling'],
      is_active: false,
      track_inventory: true,
      store_id: 'store-1',
      inventory: [
        {
          id: 'inv-3',
          product_id: 'prod-3',
          store_id: 'store-1',
          quantity: 25,
          reserved_quantity: 1,
          low_stock_threshold: 10,
          track_quantity: true,
          updated_at: '2024-06-20T15:00:00Z'
        }
      ],
      created_at: '2024-06-05T10:00:00Z',
      updated_at: '2024-06-12T14:00:00Z'
    }
  ];

  const fetchProducts = async (filters?: ProductFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching products with filters:', filters);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      let filteredProducts = [...mockProducts];
      
      // Apply filters
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p =>
          p.name.toLowerCase().includes(search) ||
          p.brand.toLowerCase().includes(search) ||
          p.sku.toLowerCase().includes(search) ||
          p.tags.some(tag => tag.toLowerCase().includes(search))
        );
      }
      
      if (filters?.category_id) {
        filteredProducts = filteredProducts.filter(p => p.category_id === filters.category_id);
      }
      
      if (filters?.is_active !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.is_active === filters.is_active);
      }
      
      if (filters?.low_stock) {
        filteredProducts = filteredProducts.filter(p => {
          const inventory = p.inventory?.[0];
          return inventory && inventory.quantity <= inventory.low_stock_threshold;
        });
      }
      
      if (filters?.store_id) {
        filteredProducts = filteredProducts.filter(p => p.store_id === filters.store_id);
      }
      
      setProducts(filteredProducts);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: CreateProductData): Promise<Product> => {
    try {
      console.log('Creating product:', productData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        ...productData,
        is_active: true,
        variants: productData.variants?.map((v, i) => ({
          ...v,
          id: `var-${Date.now()}-${i}`,
          product_id: `prod-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })),
        inventory: productData.inventory ? [{
          id: `inv-${Date.now()}`,
          product_id: `prod-${Date.now()}`,
          store_id: productData.store_id,
          quantity: productData.inventory.quantity,
          reserved_quantity: 0,
          low_stock_threshold: productData.inventory.low_stock_threshold,
          track_quantity: productData.track_inventory,
          updated_at: new Date().toISOString()
        }] : [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setProducts(prev => [...prev, newProduct]);
      toast.success('Product created successfully');
      return newProduct;
    } catch (err: any) {
      console.error('Error creating product:', err);
      toast.error('Failed to create product');
      throw err;
    }
  };

  const updateProduct = async (productId: string, updates: Partial<Product>): Promise<Product> => {
    try {
      console.log('Updating product:', productId, updates);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedProduct = products.find(p => p.id === productId);
      if (!updatedProduct) throw new Error('Product not found');
      
      const newProduct = { ...updatedProduct, ...updates, updated_at: new Date().toISOString() };
      setProducts(prev => prev.map(p => p.id === productId ? newProduct : p));
      toast.success('Product updated successfully');
      return newProduct;
    } catch (err: any) {
      console.error('Error updating product:', err);
      toast.error('Failed to update product');
      throw err;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      console.log('Deleting product:', productId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success('Product deleted successfully');
    } catch (err: any) {
      console.error('Error deleting product:', err);
      toast.error('Failed to delete product');
      throw err;
    }
  };

  const toggleProductStatus = async (productId: string, isActive: boolean) => {
    try {
      await updateProduct(productId, { is_active: isActive });
    } catch (err) {
      console.error('Error toggling product status:', err);
    }
  };

  const duplicateProduct = async (product: Product) => {
    try {
      const duplicateData: CreateProductData = {
        name: `${product.name} (Copy)`,
        description: product.description,
        brand: product.brand,
        category_id: product.category_id,
        sku: `${product.sku}-COPY`,
        price: product.price,
        cost_price: product.cost_price,
        compare_at_price: product.compare_at_price,
        images: [...product.images],
        tags: [...product.tags],
        track_inventory: product.track_inventory,
        store_id: product.store_id,
        metadata: product.metadata ? { ...product.metadata } : undefined,
        variants: product.variants?.map(v => ({
          name: v.name,
          sku: v.sku ? `${v.sku}-COPY` : undefined,
          price: v.price,
          attributes: { ...v.attributes }
        })),
        inventory: product.inventory?.[0] ? {
          quantity: 0,
          low_stock_threshold: product.inventory[0].low_stock_threshold
        } : undefined
      };
      
      await createProduct(duplicateData);
    } catch (err) {
      console.error('Error duplicating product:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [merchantId]);

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    duplicateProduct,
    refetch: fetchProducts
  };
};
