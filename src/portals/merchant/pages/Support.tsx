
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, MessageCircle, BookOpen, Phone } from 'lucide-react';
import SupportTicketSystem from '../components/SupportTicketSystem';

const Support: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Support & Help</h1>
        <p className="text-gray-600 mt-2">
          Get help when you need it with our comprehensive support resources
        </p>
      </div>

      {/* Quick Help Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Help Center
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Browse our comprehensive documentation and tutorials
            </p>
            <Button variant="outline" className="w-full">
              Browse Articles
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
              Live Chat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Chat with our support team in real-time
            </p>
            <Button variant="outline" className="w-full">
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-purple-600" />
              Phone Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Call us for urgent issues or complex problems
            </p>
            <Button variant="outline" className="w-full">
              View Numbers
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Support Tickets */}
      <SupportTicketSystem merchantId="debug-merchant-id" />

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h4 className="font-medium mb-2">How do I verify my merchant account?</h4>
              <p className="text-sm text-gray-600">
                Upload your business documentation in the Settings > Verification section. Our team will review and approve within 1-3 business days.
              </p>
            </div>
            <div className="border-b pb-4">
              <h4 className="font-medium mb-2">How do I add products to my store?</h4>
              <p className="text-sm text-gray-600">
                Go to Products > Add Product or use our bulk upload feature to import multiple products at once via CSV.
              </p>
            </div>
            <div className="border-b pb-4">
              <h4 className="font-medium mb-2">How do payment processing and fees work?</h4>
              <p className="text-sm text-gray-600">
                Connect your Stripe account in Integrations. We charge a small platform fee on each transaction, with transparent pricing.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Can I manage multiple store locations?</h4>
              <p className="text-sm text-gray-600">
                Yes! Add multiple stores in the Stores section. Each store can have its own inventory, hours, and settings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;
