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
  PlaneIcon,
  MapPinIcon,
  UsersIcon,
  HotelIcon,
  HomeIcon,
  CarIcon,
  CreditCardIcon
} from 'lucide-react';

interface NavItemProps {
  name: string;
  path: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem = ({ name, path, icon, isActive, onClick }: NavItemProps) => (
  <Link
    to={path}
    onClick={onClick}
    className={cn(
      'group flex items-center px-4 py-3 text-sm font-medium transition-colors',
      'rounded-md',
      isActive 
        ? 'bg-blue-50 text-blue-700 font-semibold' 
        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
      'mb-1 last:mb-0'
    )}
  >
    <span className={cn(
      'flex items-center justify-center w-6 h-6 mr-3',
      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
    )}>
      {icon}
    </span>
    {name}
  </Link>
);

const NavBar = () => {
  const location = useLocation();

  const navItems = [
    { 
      name: 'Find Flights', 
      path: '/', 
      icon: <Plane className="h-4 w-4" />,
      iconActive: <PlaneIcon className="h-4 w-4" />,
      exact: true
    },
    { 
      name: 'Flight Tracker', 
      path: '/flight-tracker', 
      icon: <MapPin className="h-4 w-4" />,
      iconActive: <MapPinIcon className="h-4 w-4" />
    },
    { 
      name: 'Hotels', 
      path: '/hotels', 
      icon: <Hotel className="h-4 w-4" />,
      iconActive: <HotelIcon className="h-4 w-4" />
    },
    { 
      name: 'Hostels', 
      path: '/hostels', 
      icon: <Home className="h-4 w-4" />,
      iconActive: <HomeIcon className="h-4 w-4" />
    },
    { 
      name: 'Cabs', 
      path: '/cabs', 
      icon: <Car className="h-4 w-4" />,
      iconActive: <CarIcon className="h-4 w-4" />
    },
    { 
      name: 'Team', 
      path: '/team', 
      icon: <Users className="h-4 w-4" />,
      iconActive: <UsersIcon className="h-4 w-4" />
    },
    { 
      name: 'Credits', 
      path: '/credits', 
      icon: <CreditCard className="h-4 w-4" />,
      iconActive: <CreditCardIcon className="h-4 w-4" />
    },
  ];

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:pt-5 lg:pb-4">
      <div className="flex items-center flex-shrink-0 px-4">
        <Link to="/" className="flex items-center">
          <Plane className="h-8 w-8 text-blue-600 mr-2" />
          <span className="text-xl font-bold text-gray-900">AirPriceNavigator</span>
        </Link>
      </div>
      
      <nav className="mt-8 flex-1 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact 
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);
          return (
            <NavItem
              key={item.path}
              name={item.name}
              path={item.path}
              icon={isActive ? item.iconActive : item.icon}
              isActive={isActive}
            />
          );
        })}
      </nav>
      
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">
              Need help?
            </p>
            <Link to="/contact" className="text-xs font-medium text-blue-600 hover:text-blue-500">
              Contact support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
