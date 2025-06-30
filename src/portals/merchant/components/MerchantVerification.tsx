
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface MerchantVerificationProps {
  merchantId: string;
  verificationStatus?: 'pending' | 'verified' | 'rejected' | 'incomplete';
}

const MerchantVerification: React.FC<MerchantVerificationProps> = ({ 
  merchantId, 
  verificationStatus = 'incomplete' 
}) => {
  const [documents, setDocuments] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setDocuments(prev => [...prev, ...files]);
    toast.success(`${files.length} document(s) added`);
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const submitVerification = async () => {
    if (documents.length === 0) {
      toast.error('Please upload at least one verification document');
      return;
    }

    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      toast.success('Verification documents submitted for review');
    }, 2000);
  };

  const getStatusBadge = () => {
    switch (verificationStatus) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending Review</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">Incomplete</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Merchant Verification</CardTitle>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-gray-600">
          Upload business documents to verify your merchant account
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {verificationStatus === 'verified' ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-green-800 mb-2">
              Account Verified
            </h3>
            <p className="text-green-600">
              Your merchant account has been successfully verified
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <Label>Required Documents</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload business license, tax documents, or other verification documents
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="verification-upload"
                />
                <Button variant="outline" asChild>
                  <label htmlFor="verification-upload">
                    Choose Files
                  </label>
                </Button>
              </div>
            </div>

            {documents.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Documents</Label>
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">{doc.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(doc.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {verificationStatus === 'pending' ? (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Under Review</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Your verification documents are being reviewed. This usually takes 1-3 business days.
                </p>
              </div>
            ) : verificationStatus === 'rejected' ? (
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-red-800 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">Verification Rejected</span>
                </div>
                <p className="text-sm text-red-700">
                  Your verification documents were rejected. Please upload new documents or contact support.
                </p>
              </div>
            ) : (
              <Button 
                onClick={submitVerification} 
                disabled={uploading || documents.length === 0}
                className="w-full"
              >
                {uploading ? 'Submitting...' : 'Submit for Verification'}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MerchantVerification;
