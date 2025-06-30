
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

interface BulkProductUploadProps {
  storeId: string;
  onUploadComplete?: (results: any) => void;
}

const BulkProductUpload: React.FC<BulkProductUploadProps> = ({ storeId, onUploadComplete }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [uploadResults, setUploadResults] = useState<{
    successful: number;
    failed: number;
    total: number;
  } | null>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setValidationErrors([]);
    setUploadResults(null);

    try {
      // Simulate file processing
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        
        // Validate headers
        const requiredHeaders = ['name', 'description', 'price', 'category', 'sku'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        
        if (missingHeaders.length > 0) {
          toast.error(`Missing required headers: ${missingHeaders.join(', ')}`);
          setIsUploading(false);
          return;
        }

        // Simulate processing with progress
        const totalRows = lines.length - 1;
        let processedRows = 0;
        let successfulRows = 0;
        let errors: ValidationError[] = [];

        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',');
          
          // Simulate validation
          if (Math.random() > 0.9) { // 10% error rate for demo
            errors.push({
              row: i,
              field: 'price',
              message: 'Invalid price format'
            });
          } else {
            successfulRows++;
          }

          processedRows++;
          setUploadProgress((processedRows / totalRows) * 100);
          
          // Simulate processing delay
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        setValidationErrors(errors);
        setUploadResults({
          successful: successfulRows,
          failed: errors.length,
          total: totalRows
        });

        if (errors.length === 0) {
          toast.success(`Successfully uploaded ${successfulRows} products`);
        } else {
          toast.warning(`Uploaded ${successfulRows} products with ${errors.length} errors`);
        }

        onUploadComplete?.({
          successful: successfulRows,
          failed: errors.length,
          errors
        });
      };

      reader.readAsText(file);
    } catch (error) {
      toast.error('Error processing file');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  }, [storeId, onUploadComplete]);

  const downloadTemplate = () => {
    const csvContent = `name,description,price,category,sku,brand,inventory_count,images
"Premium Skinny Jeans","High-quality denim jeans","89.99","Clothing","SKU-001","BrandName","50","image1.jpg,image2.jpg"
"Classic T-Shirt","Comfortable cotton t-shirt","24.99","Clothing","SKU-002","BrandName","100","image3.jpg"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_upload_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Template downloaded');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Bulk Product Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Download */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Download CSV Template</h4>
            <p className="text-sm text-gray-600">
              Use our template to ensure proper formatting
            </p>
          </div>
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
        </div>

        {/* File Upload */}
        <div className="space-y-4">
          <div>
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="cursor-pointer"
            />
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Processing products...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}
        </div>

        {/* Upload Results */}
        {uploadResults && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Upload completed: {uploadResults.successful} successful, {uploadResults.failed} failed 
              out of {uploadResults.total} total products.
            </AlertDescription>
          </Alert>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Validation Errors ({validationErrors.length}):</p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {validationErrors.slice(0, 10).map((error, index) => (
                    <div key={index} className="text-sm">
                      Row {error.row}: {error.field} - {error.message}
                    </div>
                  ))}
                  {validationErrors.length > 10 && (
                    <p className="text-sm">... and {validationErrors.length - 10} more errors</p>
                  )}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Upload Instructions:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use the CSV template provided above</li>
            <li>• Ensure all required fields are filled (name, price, category, SKU)</li>
            <li>• Images should be comma-separated filenames</li>
            <li>• Price should be in decimal format (e.g., 19.99)</li>
            <li>• Maximum 1000 products per upload</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkProductUpload;
