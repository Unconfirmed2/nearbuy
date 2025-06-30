
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BulkProductUploadProps {
  storeId: string;
  onUploadComplete: () => void;
}

const BulkProductUpload: React.FC<BulkProductUploadProps> = ({
  storeId,
  onUploadComplete
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    total: number;
    success: number;
    errors: string[];
  } | null>(null);

  const downloadTemplate = () => {
    const csvContent = `name,description,brand,category,sku,price,cost_price,compare_at_price,tags,track_inventory,quantity,low_stock_threshold
"Sample Product","Product description","Brand Name","Electronics","SKU001",29.99,15.00,39.99,"electronics,gadgets",true,100,10
"Another Product","Another description","Brand Name","Accessories","SKU002",19.99,8.00,,"accessories",false,0,0`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-upload-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setUploading(true);
    setProgress(0);
    setResults(null);

    try {
      // Simulate file processing
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',');
        
        // Validate headers
        const requiredHeaders = ['name', 'description', 'brand', 'sku', 'price'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        
        if (missingHeaders.length > 0) {
          toast.error(`Missing required columns: ${missingHeaders.join(', ')}`);
          setUploading(false);
          return;
        }

        // Simulate processing each row
        const totalRows = lines.length - 1;
        let successCount = 0;
        const errors: string[] = [];

        for (let i = 1; i < lines.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setProgress((i / totalRows) * 100);
          
          // Simulate validation and processing
          const row = lines[i].split(',');
          if (row.length !== headers.length) {
            errors.push(`Row ${i}: Invalid number of columns`);
          } else {
            successCount++;
          }
        }

        setResults({
          total: totalRows,
          success: successCount,
          errors: errors.slice(0, 10) // Show first 10 errors
        });

        if (successCount > 0) {
          toast.success(`Successfully uploaded ${successCount} products`);
          onUploadComplete();
        }
      };
      
      reader.readAsText(file);
    } catch (error) {
      toast.error('Failed to process file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Product Upload</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={downloadTemplate}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Template
          </Button>
          <span className="text-sm text-gray-600">
            Download the CSV template to get started
          </span>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="csv-upload"
          />
          <Label htmlFor="csv-upload" className="cursor-pointer">
            <span className="text-sm text-gray-600">
              {uploading ? "Processing..." : "Click to upload CSV file"}
            </span>
          </Label>
        </div>

        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Processing products...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {results && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Successful</span>
                </div>
                <div className="text-2xl font-bold text-green-900 mt-1">
                  {results.success}
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Errors</span>
                </div>
                <div className="text-2xl font-bold text-red-900 mt-1">
                  {results.errors.length}
                </div>
              </div>
            </div>

            {results.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">Errors Found:</h4>
                <ul className="text-red-700 text-sm space-y-1">
                  {results.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">CSV Format Guidelines</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Use comma-separated values (.csv format)</li>
            <li>• Include all required columns: name, description, brand, sku, price</li>
            <li>• Use semicolons to separate multiple tags</li>
            <li>• Set track_inventory to true/false for inventory tracking</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkProductUpload;
