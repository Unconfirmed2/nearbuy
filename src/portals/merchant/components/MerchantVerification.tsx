
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, File, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';

interface Document {
  id: string;
  type: 'business_license' | 'tax_id' | 'identity' | 'other';
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
  size?: number;
  rejectionReason?: string;
}

interface MerchantVerificationProps {
  merchantId: string;
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'incomplete';
  documents?: Document[];
  onUploadDocument?: (file: File, type: string) => void;
  onRemoveDocument?: (documentId: string) => void;
}

const MerchantVerification: React.FC<MerchantVerificationProps> = ({
  merchantId,
  verificationStatus,
  documents: externalDocuments,
  onUploadDocument,
  onRemoveDocument
}) => {
  const [documents, setDocuments] = useState<Document[]>(externalDocuments || []);
  const [uploading, setUploading] = useState<string | null>(null);

  const documentTypes = [
    { id: 'business_license', label: 'Business License', required: true },
    { id: 'tax_id', label: 'Tax ID Document', required: true },
    { id: 'identity', label: 'Identity Verification', required: true },
    { id: 'other', label: 'Other Supporting Documents', required: false }
  ];

  const handleFileUpload = async (file: File, type: string) => {
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, and PDF files are allowed');
      return;
    }

    try {
      setUploading(type);

      if (onUploadDocument) {
        onUploadDocument(file, type);
      } else {
        // Simulate upload
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const newDocument: Document = {
          id: `doc-${Date.now()}`,
          type: type as any,
          name: file.name,
          status: 'pending',
          uploadedAt: new Date().toISOString(),
          size: file.size
        };

        setDocuments(prev => {
          // Remove existing document of same type
          const filtered = prev.filter(doc => doc.type !== type);
          return [...filtered, newDocument];
        });
      }

      toast.success('Document uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload document');
    } finally {
      setUploading(null);
    }
  };

  const handleRemoveDocument = (documentId: string) => {
    if (onRemoveDocument) {
      onRemoveDocument(documentId);
    } else {
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    }
    toast.success('Document removed');
  };

  const getDocumentStatus = (type: string) => {
    return documents.find(doc => doc.type === type);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">Not Uploaded</Badge>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const completedDocuments = documents.filter(doc => doc.status === 'approved').length;
  const totalRequired = documentTypes.filter(type => type.required).length;
  const progress = totalRequired > 0 ? (completedDocuments / totalRequired) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Verification Progress</span>
            <span className="text-sm text-gray-600">{completedDocuments}/{totalRequired} required documents</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
          {verificationStatus === 'rejected' && (
            <p className="text-sm text-red-600 mt-2">
              Some documents were rejected. Please review and resubmit.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Document Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Required Documents</h3>
        
        {documentTypes.map(type => {
          const document = getDocumentStatus(type.id);
          const isUploading = uploading === type.id;
          
          return (
            <Card key={type.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{type.label}</h4>
                      {type.required && <Badge variant="outline" className="text-xs">Required</Badge>}
                      {document && getStatusIcon(document.status)}
                    </div>
                    
                    {document ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <File className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{document.name}</span>
                          {document.size && (
                            <span className="text-xs text-gray-500">({formatFileSize(document.size)})</span>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveDocument(document.id)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(document.status)}
                          <span className="text-xs text-gray-500">
                            Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                        {document.status === 'rejected' && document.rejectionReason && (
                          <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            Rejection reason: {document.rejectionReason}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 mb-3">
                        Upload your {type.label.toLowerCase()} for verification
                      </p>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    <Label htmlFor={`file-${type.id}`}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={isUploading}
                        className="cursor-pointer"
                        asChild
                      >
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          {isUploading ? 'Uploading...' : document ? 'Replace' : 'Upload'}
                        </span>
                      </Button>
                    </Label>
                    <Input
                      id={`file-${type.id}`}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file, type.id);
                        }
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upload Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <p>• Upload clear, high-quality images or PDF documents</p>
          <p>• Maximum file size: 10MB</p>
          <p>• Accepted formats: JPEG, PNG, PDF</p>
          <p>• Ensure all text in documents is clearly readable</p>
          <p>• Documents must be current and not expired</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantVerification;
