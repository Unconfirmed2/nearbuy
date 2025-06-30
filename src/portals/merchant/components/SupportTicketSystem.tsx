
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HelpCircle, MessageSquare, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  merchant_id: string;
}

interface SupportTicketSystemProps {
  tickets: SupportTicket[];
  onCreateTicket: (ticket: Omit<SupportTicket, 'id' | 'created_at' | 'updated_at' | 'merchant_id'>) => void;
  onUpdateTicket: (ticketId: string, updates: Partial<SupportTicket>) => void;
}

const SupportTicketSystem: React.FC<SupportTicketSystemProps> = ({
  tickets,
  onCreateTicket,
  onUpdateTicket
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: '',
    priority: 'medium' as const,
    status: 'open' as const
  });

  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.description || !newTicket.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    onCreateTicket(newTicket);
    setNewTicket({
      subject: '',
      description: '',
      category: '',
      priority: 'medium',
      status: 'open'
    });
    setShowCreateDialog(false);
    toast.success('Support ticket created successfully');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'Open' },
      in_progress: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle, label: 'In Progress' },
      resolved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Resolved' },
      closed: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle, label: 'Closed' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open;
    const StatusIcon = config.icon;

    return (
      <Badge className={config.color}>
        <StatusIcon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Support Center</h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <HelpCircle className="w-4 h-4 mr-2" />
              Create Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  placeholder="Brief description of the issue"
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={newTicket.category} onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="account">Account Issues</SelectItem>
                    <SelectItem value="orders">Order Management</SelectItem>
                    <SelectItem value="products">Product Listings</SelectItem>
                    <SelectItem value="payments">Payments & Billing</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={newTicket.priority} onValueChange={(value: any) => setNewTicket({ ...newTicket, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Detailed description of the issue"
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateTicket} className="flex-1">
                  Create Ticket
                </Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tickets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No support tickets</h3>
              <p className="text-gray-600 mb-4">
                You haven't created any support tickets yet.
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                Create Your First Ticket
              </Button>
            </CardContent>
          </Card>
        ) : (
          tickets.map(ticket => (
            <Card key={ticket.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                    <p className="text-sm text-gray-600">#{ticket.id}</p>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{ticket.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Category: {ticket.category}</span>
                  <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SupportTicketSystem;
