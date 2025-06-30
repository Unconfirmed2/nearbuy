
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Heart, Users, Star, Reply } from 'lucide-react';

interface CustomerEngagementProps {
  storeId: string;
}

const CustomerEngagement: React.FC<CustomerEngagementProps> = ({ storeId }) => {
  const [replyText, setReplyText] = useState('');
  const [selectedReview, setSelectedReview] = useState<string | null>(null);

  const mockReviews = [
    {
      id: 'review-1',
      customer: 'John Doe',
      product: 'iPhone 15 Pro',
      rating: 5,
      comment: 'Great product and excellent service! The pickup was super convenient.',
      date: '2024-06-25',
      responded: false
    },
    {
      id: 'review-2',
      customer: 'Jane Smith',
      product: 'MacBook Air',
      rating: 4,
      comment: 'Good quality product. Delivery was quick and hassle-free.',
      date: '2024-06-20',
      responded: true,
      merchantReply: 'Thank you for your review! We appreciate your business.'
    }
  ];

  const mockFavorites = [
    {
      product: 'iPhone 15 Pro',
      favoriteCount: 45,
      viewCount: 1250
    },
    {
      product: 'MacBook Air',
      favoriteCount: 32,
      viewCount: 890
    },
    {
      product: 'AirPods Pro',
      favoriteCount: 28,
      viewCount: 567
    }
  ];

  const handleReplySubmit = (reviewId: string) => {
    if (replyText.trim()) {
      // Handle reply submission
      console.log('Reply to review:', reviewId, replyText);
      setReplyText('');
      setSelectedReview(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">4.7</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">105</div>
                <div className="text-sm text-gray-600">Total Favorites</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-gray-600">Pending Replies</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Customer Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockReviews.map(review => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{review.customer}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{review.product}</div>
                      <p className="text-sm mb-2">{review.comment}</p>
                      <div className="text-xs text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {review.responded && (
                        <Badge className="bg-green-100 text-green-800">Responded</Badge>
                      )}
                    </div>
                  </div>

                  {review.merchantReply && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Reply className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Your Reply</span>
                      </div>
                      <p className="text-sm text-blue-700">{review.merchantReply}</p>
                    </div>
                  )}

                  {!review.responded && (
                    <div className="mt-3">
                      {selectedReview === review.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your reply..."
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleReplySubmit(review.id)}
                            >
                              Send Reply
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedReview(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedReview(review.id)}
                        >
                          <Reply className="w-4 h-4 mr-1" />
                          Reply
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Product Favorites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockFavorites.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{item.product}</div>
                    <div className="text-sm text-gray-600">
                      {item.viewCount} views
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-600" />
                    <span className="font-medium">{item.favoriteCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerEngagement;
