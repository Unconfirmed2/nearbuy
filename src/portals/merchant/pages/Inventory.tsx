
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Upload, TrendingDown } from 'lucide-react';
import InventoryManager from '../components/InventoryManager';
import BulkProductUpload from '../components/BulkProductUpload';

const Inventory: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-gray-600 mt-2">
          Track and manage your product inventory across all stores
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bulk-upload">Bulk Upload</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <InventoryManager />
        </TabsContent>

        <TabsContent value="bulk-upload">
          <BulkProductUpload 
            storeId="debug-store-id"
            onUploadComplete={(results) => {
              console.log('Upload completed:', results);
            }}
          />
        </TabsContent>

        <TabsContent value="low-stock">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Advanced Low Stock Management
                </h3>
                <p className="text-gray-600 mb-6">
                  Set up automated alerts and reorder points for your inventory
                </p>
                <Button disabled>
                  <Upload className="w-4 h-4 mr-2" />
                  Configure Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;
