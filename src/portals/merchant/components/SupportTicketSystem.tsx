
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Plus, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
  last_reply: string;
}

interface SupportTicketSystemProps {
  merchantId: string;
}

const SupportTicketSystem: React.FC<SupportTicketSystemProps> = ({ merchantId }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    priority: 'medium' as const,
    description: ''
  });

  const [tickets] = useState<SupportTicket[]>([
    {
      id: '1',
      subject: 'Issues with inventory sync',
      category: 'Technical',
      priority: 'high',
      status: 'in_progress',
      created_at: '2024-01-15',
      last_reply: '2024-01-16'
    },
    {
      id: '2',
      subject: 'Question about payment processing',
      category: 'Billing',
      priority: 'medium',
      status: 'resolved',
      created_at: '2024-01-10',
      last_reply: '2024-01-12'
    }
  ]);

  const categories = [
    'Technical Support',
    'Billing & Payments',
    'Account Management',
    'Product Issues',
    'Store Setup',
    'Integration Support',
    'Other'
  ];

  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.category || !newTicket.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    console.log('Creating support ticket:', newTicket);
    toast.success('Support ticket created successfully');
    setShowCreateForm(false);
    setNewTicket({ subject: '', category: '', priority: 'medium', description: '' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />Open</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800"><MessageSquare className="w-3 h-3 mr-1" />In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Support Tickets
            </CardTitle>
            <p className="text-sm text-gray-600">
              Get help with any issues or questions you have
            </p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <div className="mb-6 p-4 border rounded-lg space-y-4">
              <h3 className="font-medium">Create New Support Ticket</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Subject *</Label>
                  <Input
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Brief description of the issue"
                  />
                </div>
                
                <div>
                  <Label>Category *</Label>
                  <Select value={newTicket.category} onValueChange={(value) => setNewTicket(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Priority</Label>
                <Select value={newTicket.priority} onValueChange={(value: any) => setNewTicket(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Description *</Label>
                <Textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide detailed information about your issue"
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateTicket}>Create Ticket</Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {tickets.map(ticket => (
              <div key={ticket.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{ticket.subject}</h4>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Category: {ticket.category}</span>
                      <span className={`capitalize ${getPriorityColor(ticket.priority)}`}>
                        Priority: {ticket.priority}
                      </span>
                      <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}

            {tickets.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No support tickets yet</p>
                <p className="text-sm">Create a ticket if you need help</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportTicketSystem;
