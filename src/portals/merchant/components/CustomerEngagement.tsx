
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, MessageSquare, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  product_name: string;
  created_at: string;
  merchant_reply?: string;
  replied_at?: string;
}

interface CustomerEngagementProps {
  merchantId: string;
}

const CustomerEngagement: React.FC<CustomerEngagementProps> = ({ merchantId }) => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'review-1',
      customer_name: 'Sarah Johnson',
      rating: 5,
      comment: 'Great quality jeans, perfect fit!',
      product_name: 'Premium Skinny Jeans',
      created_at: new Date().toISOString(),
    },
    {
      id: 'review-2',
      customer_name: 'Mike Chen',
      rating: 4,
      comment: 'Good product but shipping took a while.',
      product_name: 'Classic T-Shirt',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      merchant_reply: 'Thank you for the feedback! We\'re working on faster shipping.',
      replied_at: new Date().toISOString(),
    }
  ]);

  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [showReplyForm, setShowReplyForm] = useState<{ [key: string]: boolean }>({});

  const handleReply = (reviewId: string) => {
    const reply = replyText[reviewId];
    if (!reply?.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            merchant_reply: reply,
            replied_at: new Date().toISOString()
          }
        : review
    ));

    setReplyText(prev => ({ ...prev, [reviewId]: '' }));
    setShowReplyForm(prev => ({ ...prev, [reviewId]: false }));
    toast.success('Reply posted successfully');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const favoriteStats = {
    total_favorites: 234,
    this_week: 12,
    top_favorited: 'Premium Skinny Jeans'
  };

  return (
    <div className="space-y-6">
      {/* Favorite Product Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Favorites</p>
                <p className="text-2xl font-bold">{favoriteStats.total_favorites}</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-green-600">+{favoriteStats.this_week}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Most Favorited</p>
              <p className="text-lg font-semibold">{favoriteStats.top_favorited}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Customer Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="border-b pb-6 last:border-b-0">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{review.customer_name}</span>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>
                    <p className="text-sm text-gray-600">{review.product_name}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-gray-800 mb-3">{review.comment}</p>
                
                {review.merchant_reply ? (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">Your Reply</Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(review.replied_at!).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{review.merchant_reply}</p>
                  </div>
                ) : showReplyForm[review.id] ? (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Write your reply..."
                      value={replyText[review.id] || ''}
                      onChange={(e) => setReplyText(prev => ({ ...prev, [review.id]: e.target.value }))}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleReply(review.id)}
                      >
                        Post Reply
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setShowReplyForm(prev => ({ ...prev, [review.id]: false }))}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowReplyForm(prev => ({ ...prev, [review.id]: true }))}
                  >
                    Reply to Review
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerEngagement;
