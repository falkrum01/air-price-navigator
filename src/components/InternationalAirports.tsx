import React, { useState } from 'react';
import { Search, Plane, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const airports = [
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', popular: true },
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', popular: true },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', popular: true },
  { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia' },
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom' },
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA' },
  { code: 'SYD', name: 'Sydney Airport', city: 'Sydney', country: 'Australia' },
  { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada' },
];

const InternationalAirports: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAirports = airports.filter(airport => 
    airport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    airport.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    airport.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularAirports = airports.filter(airport => airport.popular);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">International Airports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search airports..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {searchQuery === '' && (
          <>
            <h4 className="text-sm font-medium mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-blue-500" />
              Popular Destinations
            </h4>
            <div className="grid grid-cols-1 gap-3 mb-6">
              {popularAirports.map((airport) => (
                <div key={airport.code} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Plane className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{airport.city}</div>
                    <div className="text-xs text-gray-500">{airport.country}</div>
                  </div>
                  <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {airport.code}
                  </div>
                </div>
              ))}
            </div>
            <h4 className="text-sm font-medium mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-blue-500" />
              All Airports
            </h4>
          </>
        )}

        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {filteredAirports.length > 0 ? (
            filteredAirports.map((airport) => (
              <div 
                key={airport.code} 
                className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="bg-gray-100 p-2 rounded-full mr-3">
                  <Plane className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{airport.name}</div>
                  <div className="text-xs text-gray-500">{airport.city}, {airport.country}</div>
                </div>
                <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {airport.code}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              No airports found matching "{searchQuery}"
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InternationalAirports;
