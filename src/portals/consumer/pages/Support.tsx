
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, HelpCircle, Send, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

const Support: React.FC = () => {
  const [newTicket, setNewTicket] = useState({
    subject: '',
    message: '',
    priority: 'medium' as const
  });
  const [tickets] = useState<SupportTicket[]>([
    {
      id: 'ticket-1',
      subject: 'Unable to complete order',
      message: 'I was trying to place an order but the checkout page is not loading properly.',
      status: 'in_progress',
      priority: 'high',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T14:20:00Z'
    },
    {
      id: 'ticket-2',
      subject: 'Question about store hours',
      message: 'What are the pickup hours for Downtown Market?',
      status: 'closed',
      priority: 'low',
      created_at: '2024-01-12T09:15:00Z',
      updated_at: '2024-01-12T11:45:00Z'
    }
  ]);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Mock ticket submission
    toast.success('Support ticket submitted! We\'ll get back to you soon.');
    setNewTicket({ subject: '', message: '', priority: 'medium' });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      open: 'destructive',
      in_progress: 'default',
      closed: 'secondary'
    };
    return (
      <Badge variant={variants[status] || 'default'}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return (
      <Badge className={colors[priority] || colors.medium}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Support Center</h1>

      <Tabs defaultValue="submit" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="submit">Submit Ticket</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="submit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Submit Support Ticket</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Subject *</label>
                  <Input
                    placeholder="Brief description of your issue"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({...newTicket, priority: e.target.value as any})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <Textarea
                    placeholder="Please describe your issue in detail..."
                    rows={6}
                    value={newTicket.message}
                    onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Ticket
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          {tickets.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No support tickets</h2>
                <p className="text-gray-600">You haven't submitted any support tickets yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <Card key={ticket.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                        <p className="text-sm text-gray-600">Ticket #{ticket.id}</p>
                      </div>
                      <div className="flex space-x-2">
                        {getPriorityBadge(ticket.priority)}
                        {getStatusBadge(ticket.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{ticket.message}</p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Created: {new Date(ticket.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Updated: {new Date(ticket.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5" />
                <span>Frequently Asked Questions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">How do I place an order?</h3>
                <p className="text-gray-600">Search for products, add them to your cart, and proceed to checkout. You can pick up your items at the designated store locations.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Can I cancel my order?</h3>
                <p className="text-gray-600">You can cancel your order up to 30 minutes before your scheduled pickup time. Go to Order History and click "Cancel Order".</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">What if an item is out of stock?</h3>
                <p className="text-gray-600">If an item becomes unavailable after you place your order, we'll contact you with replacement options or issue a refund.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">How does the route planner work?</h3>
                <p className="text-gray-600">Our route planner optimizes your pickup route across multiple stores to save you time and travel distance.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">We accept all major credit cards, debit cards, and digital payment methods through our secure payment processor.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Support;
