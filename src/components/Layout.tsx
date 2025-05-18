
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Plane, LogOut, User, Search, MapPin, Users, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getUserInitials = () => {
    if (!user) return "U";
    
    const name = user.user_metadata.full_name || user.email || "";
    
    if (!name) return "U";
    
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    
    return name[0].toUpperCase();
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-white shadow-sm fixed w-full z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-airblue p-1.5 rounded-md">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:inline">SkyPredict</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center ml-10 space-x-8">
              <Link 
                to="/" 
                className={`flex items-center space-x-2 text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-airblue' : 'text-foreground/70 hover:text-airblue'}`}
              >
                <Search className="h-4 w-4" />
                <span>Find Flights</span>
              </Link>
              <Link 
                to="/flight-tracker" 
                className={`flex items-center space-x-2 text-sm font-medium transition-colors ${location.pathname === '/flight-tracker' ? 'text-airblue' : 'text-foreground/70 hover:text-airblue'}`}
              >
                <MapPin className="h-4 w-4" />
                <span>Flight Tracker</span>
              </Link>
              <Link 
                to="/team" 
                className={`flex items-center space-x-2 text-sm font-medium transition-colors ${location.pathname === '/team' ? 'text-airblue' : 'text-foreground/70 hover:text-airblue'}`}
              >
                <Users className="h-4 w-4" />
                <span>Team</span>
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-foreground/70 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            
            {/* Desktop Auth Buttons */}
            <div className="hidden md:block">
              {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9 bg-airblue text-white">
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium">{user.user_metadata.full_name || user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => navigate("/auth")} 
                className="bg-airblue hover:bg-airblue-dark"
              >
                <User className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
                <span className="sm:hidden">Login</span>
              </Button>
            )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 z-40 bg-white/95 backdrop-blur-sm transition-all duration-300 ease-in-out transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        <div className="h-full flex flex-col pt-20 px-6 space-y-6">
          <Link 
            to="/" 
            className={`flex items-center space-x-3 text-lg font-medium p-3 rounded-lg transition-colors ${
              location.pathname === '/' ? 'bg-airblue/10 text-airblue' : 'text-foreground/80 hover:bg-gray-100'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Search className="h-5 w-5" />
            <span>Find Flights</span>
          </Link>
          <Link 
            to="/flight-tracker" 
            className={`flex items-center space-x-3 text-lg font-medium p-3 rounded-lg transition-colors ${
              location.pathname === '/flight-tracker' ? 'bg-airblue/10 text-airblue' : 'text-foreground/80 hover:bg-gray-100'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <MapPin className="h-5 w-5" />
            <span>Flight Tracker</span>
          </Link>
          <Link 
            to="/team" 
            className={`flex items-center space-x-3 text-lg font-medium p-3 rounded-lg transition-colors ${
              location.pathname === '/team' ? 'bg-airblue/10 text-airblue' : 'text-foreground/80 hover:bg-gray-100'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Users className="h-5 w-5" />
            <span>Team</span>
          </Link>
          
          {user ? (
            <div className="mt-auto mb-8 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 bg-airblue text-white">
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.user_metadata.full_name || user.email}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="w-full justify-start mt-4 text-foreground/80"
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Button>
            </div>
          ) : (
            <Button 
              onClick={() => {
                navigate("/auth");
                setMobileMenuOpen(false);
              }} 
              className="bg-airblue hover:bg-airblue-dark mt-8"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Sign In</span>
            </Button>
          )}
        </div>
      </div>
      
      <main className="flex-1 pt-16">{children}</main>
      
      <footer className="border-t border-border bg-white">
        <div className="container mx-auto py-8 px-4">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Team</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://www.linkedin.com/in/mohammed-sohail-7a2b5a1b4/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground hover:underline flex items-center"
                  >
                    <span className="mr-1">👨‍💻</span> Mohammed Sohail (Backend)
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground hover:underline flex items-center"
                  >
                    <span className="mr-1">🎨</span> Karthik (UI/UX Developer)
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground hover:underline flex items-center"
                  >
                    <span className="mr-1">💻</span> Ashwin (Full Stack)
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <a 
                href="mailto:583mohammedsohail@gmail.com" 
                className="text-muted-foreground hover:text-foreground hover:underline"
              >
                583mohammedsohail@gmail.com
              </a>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Stay Connected</h3>
              <a 
                href="https://www.instagram.com/mohammedsohail0.2/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground hover:underline"
              >
                Instagram
              </a>
            </div>
          </div>
          
          {/* Developer credit - more prominent */}
          <div className="text-center py-4 bg-gray-50 rounded-lg mb-4">
            <p className="text-sm text-muted-foreground">
              Designed & Maintained by{' '}
              <a 
                href="https://www.linkedin.com/in/mohammed-sohail-7a2b5a1b4/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-airblue hover:underline font-medium"
              >
                Mohammed Sohail
              </a>
            </p>
          </div>
          
          {/* Copyright */}
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} SkyPredict. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
