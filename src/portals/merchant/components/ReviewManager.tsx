
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MessageSquare, Reply, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: string;
  customer_name: string;
  customer_avatar?: string;
  rating: number;
  comment: string;
  product_name?: string;
  store_name?: string;
  created_at: string;
  merchant_reply?: string;
  merchant_reply_at?: string;
}

interface ReviewManagerProps {
  merchantId: string;
  storeId?: string;
}

const ReviewManager: React.FC<ReviewManagerProps> = ({ merchantId, storeId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const [replyText, setReplyText] = useState<{[key: string]: string}>({});
  const [showReplyForm, setShowReplyForm] = useState<{[key: string]: boolean}>({});

  const handleReply = (reviewId: string) => {
    const reply = replyText[reviewId]?.trim();
    if (!reply) return;

    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            merchant_reply: reply,
            merchant_reply_at: new Date().toISOString()
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
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getRatingBadgeColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-800';
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const ratingDistribution = Array.from({ length: 5 }, (_, i) => {
    const starCount = 5 - i;
    const count = reviews.filter(review => review.rating === starCount).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { stars: starCount, count, percentage };
  });

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Review Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{averageRating}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {renderStars(Math.round(parseFloat(averageRating)))}
              </div>
              <p className="text-gray-600">{reviews.length} reviews</p>
            </div>
            
            <div className="space-y-2">
              {ratingDistribution.map(({ stars, count, percentage }) => (
                <div key={stars} className="flex items-center gap-2 text-sm">
                  <span className="w-8">{stars}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-gray-600">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
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
              <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={review.customer_avatar} />
                    <AvatarFallback>
                      {review.customer_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{review.customer_name}</span>
                      <Badge className={getRatingBadgeColor(review.rating)}>
                        {review.rating} ★
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(review.rating)}
                    </div>
                    
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    
                    {(review.product_name || review.store_name) && (
                      <div className="text-sm text-gray-500 mb-3">
                        {review.product_name && <span>Product: {review.product_name}</span>}
                        {review.product_name && review.store_name && <span> • </span>}
                        {review.store_name && <span>Store: {review.store_name}</span>}
                      </div>
                    )}
                    
                    {/* Merchant Reply */}
                    {review.merchant_reply && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Reply className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-800">Your Reply</span>
                          <span className="text-sm text-blue-600">
                            {new Date(review.merchant_reply_at!).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-blue-700">{review.merchant_reply}</p>
                      </div>
                    )}
                    
                    {/* Reply Form */}
                    {!review.merchant_reply && (
                      <div className="mt-3">
                        {!showReplyForm[review.id] ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowReplyForm(prev => ({ ...prev, [review.id]: true }))}
                          >
                            <Reply className="w-4 h-4 mr-2" />
                            Reply
                          </Button>
                        ) : (
                          <div className="space-y-2">
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
                                disabled={!replyText[review.id]?.trim()}
                              >
                                Post Reply
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setShowReplyForm(prev => ({ ...prev, [review.id]: false }));
                                  setReplyText(prev => ({ ...prev, [review.id]: '' }));
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {reviews.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No reviews yet</p>
                <p className="text-sm">Reviews will appear here when customers leave feedback</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewManager;
