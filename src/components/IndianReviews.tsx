import React from 'react';
import { Star, Quote, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const reviews = [
  {
    id: 1,
    name: 'Rahul Sharma',
    location: 'Mumbai',
    rating: 5,
    comment: 'Amazing experience! Got the best deals on flights to Goa. The price prediction feature helped me save 25% on my booking.',
    date: '2 days ago',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 2,
    name: 'Priya Patel',
    location: 'Delhi',
    rating: 4,
    comment: 'Very user-friendly interface. Found great hotel deals in Kerala. The currency converter was super helpful for my international trip planning.',
    date: '1 week ago',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: 3,
    name: 'Amit Singh',
    location: 'Bangalore',
    rating: 5,
    comment: 'The flight tracking feature is a game changer! Was able to monitor my family\'s flight in real-time. Highly recommended for frequent travelers.',
    date: '3 days ago',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
  }
];

const IndianReviews: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Indian Traveler Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="space-y-3">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.avatar} alt={review.name} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.location} • {review.date}</p>
                  </div>
                  <div className="flex items-center bg-amber-50 text-amber-800 px-2 py-1 rounded-full">
                    <Star className="h-3.5 w-3.5 fill-amber-400 mr-1" />
                    <span className="text-xs font-medium">{review.rating}.0</span>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-700 relative pl-4">
                  <Quote className="h-3 w-3 text-gray-300 absolute left-0 top-0.5" />
                  {review.comment}
                </p>
              </div>
            </div>
            {review.id < reviews.length && <div className="border-t border-gray-100"></div>}
          </div>
        ))}
        
        <div className="pt-2">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
            View all reviews
            <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndianReviews;
