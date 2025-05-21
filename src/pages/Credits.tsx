import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

const Credits: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link to="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Credits</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attributions</CardTitle>
          <CardDescription>
            We would like to thank the following resources and contributors:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Icons</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Icons by <a href="https://lucide.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lucide</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Images</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Hero images from <a href="https://unsplash.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Unsplash</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Libraries</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">React</a></li>
              <li>• <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Tailwind CSS</a></li>
              <li>• <a href="https://ui.shadcn.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">shadcn/ui</a></li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team</CardTitle>
          <CardDescription>
            Meet the team behind AirPriceNavigator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'John Doe', role: 'Founder & CEO', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
              { name: 'Jane Smith', role: 'Lead Developer', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
              { name: 'Mike Johnson', role: 'UX Designer', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
            ].map((member, index) => (
              <div key={index} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <img 
                  src={member.avatar} 
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium">{member.name}</h4>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-500 mt-8">
        <p>© {new Date().getFullYear()} AirPriceNavigator. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Credits;
