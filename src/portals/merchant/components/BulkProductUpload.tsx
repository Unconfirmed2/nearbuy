
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BulkProductUploadProps {
  merchantId: string;
}

interface UploadResult {
  filename: string;
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
  }>;
}

const BulkProductUpload: React.FC<BulkProductUploadProps> = ({ merchantId }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate processing delay
    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      setIsUploading(false);
      
      // Mock upload result
      const mockResult: UploadResult = {
        filename: file.name,
        totalRows: 50,
        successCount: 47,
        errorCount: 3,
        errors: [
          { row: 15, field: 'price', message: 'Invalid price format' },
          { row: 23, field: 'category', message: 'Category not found' },
          { row: 31, field: 'name', message: 'Product name is required' }
        ]
      };
      
      setUploadResult(mockResult);
      
      if (mockResult.errorCount === 0) {
        toast.success(`Successfully uploaded ${mockResult.successCount} products`);
      } else {
        toast.warning(`Uploaded ${mockResult.successCount} products with ${mockResult.errorCount} errors`);
      }
    }, 2500);

    // Reset file input
    event.target.value = '';
  };

  const downloadTemplate = () => {
    const csvContent = `name,description,brand,category,price,sku,quantity,images
"Premium Coffee Beans","High-quality arabica coffee beans","Coffee Co","Beverages",12.99,"COFFEE-001",50,"https://example.com/coffee.jpg"
"Organic Green Tea","Certified organic green tea leaves","Tea Masters","Beverages",8.99,"TEA-002",30,"https://example.com/tea.jpg"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-upload-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Template downloaded successfully');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Bulk Product Upload
          </CardTitle>
          <p className="text-sm text-gray-600">
            Upload multiple products at once using a CSV file
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
            <div className="text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload CSV File</h3>
              <p className="text-gray-600 mb-4">
                Select a CSV file with your product data
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
                <label htmlFor="csv-upload">
                  <Button asChild disabled={isUploading}>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose CSV File
                    </span>
                  </Button>
                </label>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Processing CSV file...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {uploadResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {uploadResult.errorCount === 0 ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  )}
                  Upload Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{uploadResult.totalRows}</div>
                      <div className="text-sm text-gray-600">Total Rows</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{uploadResult.successCount}</div>
                      <div className="text-sm text-gray-600">Successful</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{uploadResult.errorCount}</div>
                      <div className="text-sm text-gray-600">Errors</div>
                    </div>
                  </div>

                  {uploadResult.errors.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-600" />
                        Errors Found
                      </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {uploadResult.errors.map((error, index) => (
                          <div key={index} className="text-sm p-2 bg-red-50 rounded">
                            <span className="font-medium">Row {error.row}:</span> {error.message} ({error.field})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">CSV Format Requirements:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Required fields: name, price, category</li>
              <li>• Optional fields: description, brand, sku, quantity, images</li>
              <li>• Use comma-separated values</li>
              <li>• Wrap text containing commas in quotes</li>
              <li>• Image URLs should be publicly accessible</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkProductUpload;
