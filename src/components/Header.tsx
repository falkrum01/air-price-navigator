import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Plane, 
  MapPin, 
  Users, 
  Hotel, 
  Home, 
  Car,
  CreditCard,
  User,
  TrendingUp,
  LineChart,
  Building,
  Activity,
  Compass
} from 'lucide-react';
import { Button } from './ui/button';

const Header: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { 
      name: 'Find Flights', 
      path: '/home', 
      icon: <Plane className="h-5 w-5" />,
      exact: true
    },
    { 
      name: 'Flight Tracker', 
      path: '/flight-tracker', 
      icon: <Activity className="h-5 w-5" />
    },
    { 
      name: 'Price Trends', 
      path: '/price-trends', 
      icon: <LineChart className="h-5 w-5" />
    },
    { 
      name: 'Hotels', 
      path: '/hotels', 
      icon: <Hotel className="h-5 w-5" />
    },
    { 
      name: 'Hostels', 
      path: '/hostels', 
      icon: <Home className="h-5 w-5" />
    },
    { 
      name: 'Cabs', 
      path: '/cabs', 
      icon: <Car className="h-5 w-5" />
    },
    { 
      name: 'Airports', 
      path: '/airports', 
      icon: <Building className="h-5 w-5" />
    },
    { 
      name: 'Team', 
      path: '/team', 
      icon: <Users className="h-5 w-5" />
    },
    { 
      name: 'Credits', 
      path: '/credits', 
      icon: <CreditCard className="h-5 w-5" />
    },
  ];

  return (
    <header className="bg-white shadow-sm py-3 px-4 mb-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2">
          <Plane className="h-6 w-6 text-airblue" />
          <span className="text-xl font-bold text-gray-900 hidden sm:inline">AirPriceNavigator</span>
        </Link>
        
        <div className="flex items-center space-x-1 sm:space-x-2">
          {navItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
              
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-label={item.name}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  isActive 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                )}
                title={item.name}
              >
                {item.icon}
              </Link>
            );
          })}
          
          <div className="border-l border-gray-200 h-8 mx-2" />
          
          <Button variant="ghost" size="icon" className="rounded-full" aria-label="User Account">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
