import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  HelpCircle, 
  MessageSquare, 
  FileText, 
  Search,
  ExternalLink,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Package
} from 'lucide-react';
import { toast } from 'sonner';

const Support: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: '',
    description: ''
  });

  const faqs = [
    {
      question: "How do I verify my business?",
      answer: "Upload your business license and tax documents in the Settings > Verification section. Our team will review within 24-48 hours.",
      category: "Verification"
    },
    {
      question: "How do refunds work?",
      answer: "Refunds are processed through your connected Stripe account. Customers can request refunds, and you can approve them from the Orders page.",
      category: "Payments"
    },
    {
      question: "Can I manage multiple store locations?",
      answer: "Yes! You can add multiple stores from the Stores page. Each store can have its own inventory, hours, and settings.",
      category: "Stores"
    },
    {
      question: "How do I sync with my POS system?",
      answer: "Connect your POS system in Integrations. We support Shopify, Square, Lightspeed, and Clover with real-time inventory sync.",
      category: "Integrations"
    }
  ];

  const tickets = [
    {
      id: 'T-001',
      subject: 'Unable to upload product images',
      status: 'open',
      priority: 'medium',
      created: '2024-06-28',
      category: 'Technical'
    },
    {
      id: 'T-002',
      subject: 'Stripe payout question',
      status: 'resolved',
      priority: 'low',
      created: '2024-06-25',
      category: 'Billing'
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.subject || !ticketForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success('Support ticket submitted successfully');
    setTicketForm({
      subject: '',
      category: '',
      priority: '',
      description: ''
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <HelpCircle className="w-8 h-8" />
          Support Center
        </h1>
        <p className="text-gray-600 mt-2">
          Get help with your merchant account and store management
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-medium mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600 mb-4">
              Chat with our support team in real-time
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-green-600 mb-3">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              Available Now
            </div>
            <Button size="sm" className="w-full">Start Chat</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-medium mb-2">Phone Support</h3>
            <p className="text-sm text-gray-600 mb-4">
              Call us for urgent issues
            </p>
            <div className="text-sm text-gray-600 mb-3">
              <div className="flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                Mon-Fri 9AM-6PM PST
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full">
              (555) 123-4567
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-medium mb-2">Email Support</h3>
            <p className="text-sm text-gray-600 mb-4">
              Send us an email for detailed questions
            </p>
            <div className="text-sm text-gray-600 mb-3">
              Response within 4 hours
            </div>
            <Button size="sm" variant="outline" className="w-full">
              support@nearbuy.com
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="faq" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="guides">Setup Guides</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search FAQ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{faq.question}</h4>
                      <Badge variant="outline">{faq.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Submit New Ticket</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        value={ticketForm.category}
                        onChange={(e) => setTicketForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      >
                        <option value="">Select category</option>
                        <option value="technical">Technical Issue</option>
                        <option value="billing">Billing</option>
                        <option value="verification">Verification</option>
                        <option value="integration">Integration</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <select
                        id="priority"
                        value={ticketForm.priority}
                        onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      >
                        <option value="">Select priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Submit Ticket
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Support Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tickets.map(ticket => (
                    <div key={ticket.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">{ticket.subject}</div>
                          <div className="text-sm text-gray-600">#{ticket.id}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {ticket.status === 'resolved' ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Resolved
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Open
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>{ticket.category} • Priority: {ticket.priority}</span>
                        <span>{ticket.created}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="guides" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Getting Started Guide",
                description: "Complete setup guide for new merchants",
                icon: <FileText className="w-6 h-6" />
              },
              {
                title: "Store Verification",
                description: "How to verify your business and get approved",
                icon: <CheckCircle className="w-6 h-6" />
              },
              {
                title: "Product Management",
                description: "Adding, editing, and organizing your products",
                icon: <Package className="w-6 h-6" />
              },
              {
                title: "POS Integration",
                description: "Connect your existing point-of-sale system",
                icon: <MessageSquare className="w-6 h-6" />
              }
            ].map((guide, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      {guide.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{guide.title}</h3>
                      <p className="text-sm text-gray-600">{guide.description}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Support;
