
import { useState, useEffect } from 'react';
import { Product, InventoryItem } from '../types/product';
import { supabase } from '@/integrations/supabase/client';

export const useProducts = (merchantId: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        if (!merchantId) {
          setProducts([]);
          setLoading(false);
          return;
        }

        // Fetch products that belong to stores owned by this merchant
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('id')
          .eq('merchant_id', merchantId);

        if (storeError) {
          console.error('Error fetching stores:', storeError);
          setError('Failed to fetch products');
          return;
        }

        if (!storeData || storeData.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const storeIds = storeData.map(store => store.id);

        // Fetch products and their inventory
        const { data: inventoryData, error: inventoryError } = await supabase
          .from('inventory')
          .select(`
            id,
            price,
            quantity,
            store_id,
            updated_at,
            products (
              id,
              name,
              description,
              brand,
              category_id,
              image_url,
              created_at
            )
          `)
          .in('store_id', storeIds);

        if (inventoryError) {
          console.error('Error fetching inventory:', inventoryError);
          setError('Failed to fetch products');
          return;
        }

        // Transform data to Product type
        const transformedProducts: Product[] = (inventoryData || []).map(inv => ({
          id: inv.products?.id || '',
          name: inv.products?.name || '',
          description: inv.products?.description || '',
          brand: inv.products?.brand || '',
          category_id: inv.products?.category_id || '',
          sku: '', // Not in current schema
          price: inv.price,
          images: inv.products?.image_url ? [inv.products.image_url] : ['/placeholder.svg'],
          tags: [], // Not in current schema
          is_active: true, // Assuming active if in inventory
          track_inventory: true,
          store_id: inv.store_id,
          created_at: inv.products?.created_at || '',
          updated_at: inv.updated_at,
          inventory: [{
            id: inv.id.toString(),
            product_id: inv.products?.id || '',
            store_id: inv.store_id,
            quantity: inv.quantity,
            reserved_quantity: 0,
            low_stock_threshold: 5,
            track_quantity: true,
            updated_at: inv.updated_at
          }]
        })).filter(product => product.id); // Filter out products without IDs
        
        setProducts(transformedProducts);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [merchantId]);

  const createProduct = async (productData: Partial<Product>) => {
    try {
      if (!productData.store_id) {
        throw new Error('Store ID is required to create a product');
      }

      // Create product in products table
      const { data: productRecord, error: productError } = await supabase
        .from('products')
        .insert({
          name: productData.name || '',
          description: productData.description || '',
          brand: productData.brand || '',
          category_id: productData.category_id || null,
          image_url: productData.images?.[0] || null
        })
        .select()
        .single();

      if (productError) throw productError;

      // Create inventory record
      const { data: inventoryRecord, error: inventoryError } = await supabase
        .from('inventory')
        .insert({
          store_id: productData.store_id,
          product_id: productRecord.id,
          price: productData.price || 0,
          quantity: 0 // Default quantity
        })
        .select()
        .single();

      if (inventoryError) throw inventoryError;

      const newProduct: Product = {
        id: productRecord.id,
        name: productRecord.name,
        description: productRecord.description || '',
        brand: productRecord.brand || '',
        category_id: productRecord.category_id || '',
        sku: productData.sku || '',
        price: inventoryRecord.price,
        images: productRecord.image_url ? [productRecord.image_url] : ['/placeholder.svg'],
        tags: productData.tags || [],
        is_active: true,
        track_inventory: true,
        store_id: productData.store_id,
        created_at: productRecord.created_at,
        updated_at: productRecord.created_at,
        metadata: productData.metadata,
        variants: productData.variants || [],
        inventory: [{
          id: inventoryRecord.id.toString(),
          product_id: productRecord.id,
          store_id: productData.store_id,
          quantity: inventoryRecord.quantity,
          reserved_quantity: 0,
          low_stock_threshold: 5,
          track_quantity: true,
          updated_at: inventoryRecord.updated_at
        }]
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
