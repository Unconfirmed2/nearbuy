
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface MerchantVerificationProps {
  merchantId: string;
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'not_started';
  onStatusChange?: (status: string) => void;
}

const MerchantVerification: React.FC<MerchantVerificationProps> = ({
  merchantId,
  verificationStatus,
  onStatusChange
}) => {
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<string[]>([]);

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newDocuments = Array.from(files).map(file => file.name);
      setDocuments(prev => [...prev, ...newDocuments]);
      toast.success('Documents uploaded successfully');
      
      if (onStatusChange) {
        onStatusChange('pending');
      }
    } catch (error) {
      toast.error('Failed to upload documents');
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = () => {
    switch (verificationStatus) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Pending Review</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Not Started</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Business Verification</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {verificationStatus === 'verified' ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-green-800 mb-2">Verification Complete</h3>
            <p className="text-green-600">Your business has been verified and you can now accept orders.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="business-license">Business License</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <Input
                    id="business-license"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onChange={handleDocumentUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <Label htmlFor="business-license" className="cursor-pointer">
                    <span className="text-sm text-gray-600">
                      {uploading ? "Uploading..." : "Click to upload business documents"}
                    </span>
                  </Label>
                </div>
              </div>

              {documents.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Documents</Label>
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{doc}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Required Documents</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Business License or Registration</li>
                  <li>• Tax ID Documentation</li>
                  <li>• Proof of Business Address</li>
                  <li>• Government-issued ID</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MerchantVerification;
