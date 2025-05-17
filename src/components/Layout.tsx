
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Plane, LogOut, User } from "lucide-react";
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
      <header className="border-b border-border bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-airblue p-1.5 rounded-md">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">SkyPredict</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className={`text-sm font-medium ${location.pathname === '/' ? 'text-airblue' : 'hover:text-airblue'}`}>
                Find Flights
              </Link>
              <Link to="/flight-tracker" className={`text-sm font-medium ${location.pathname === '/flight-tracker' ? 'text-airblue' : 'hover:text-airblue'}`}>
                Flight Tracker
              </Link>
              <Link to="/team" className={`text-sm font-medium ${location.pathname === '/team' ? 'text-airblue' : 'hover:text-airblue'}`}>
                Team
              </Link>
            </nav>
            
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
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1">{children}</main>
      
      <footer className="border-t border-border bg-white">
        <div className="container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">About SkyPredict</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-muted-foreground hover:text-foreground">
                  <Link to="/">About Us</Link>
                </li>
                <li className="text-muted-foreground hover:text-foreground">
                  <Link to="/">How It Works</Link>
                </li>
                <li className="text-muted-foreground hover:text-foreground">
                  <Link to="/">Careers</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-muted-foreground hover:text-foreground">
                  <Link to="/">FAQs</Link>
                </li>
                <li className="text-muted-foreground hover:text-foreground">
                  <Link to="/">Contact Us</Link>
                </li>
                <li className="text-muted-foreground hover:text-foreground">
                  <Link to="/">Terms & Conditions</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Popular Destinations</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-muted-foreground hover:text-foreground">
                  <Link to="/">New York</Link>
                </li>
                <li className="text-muted-foreground hover:text-foreground">
                  <Link to="/">London</Link>
                </li>
                <li className="text-muted-foreground hover:text-foreground">
                  <Link to="/">Tokyo</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Stay Connected</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-muted-foreground hover:text-foreground">
                  <Link to="/">Newsletter</Link>
                </li>
                <li className="text-muted-foreground hover:text-foreground">
                  <Link to="/">Twitter</Link>
                </li>
                <li className="text-muted-foreground hover:text-foreground">
                  <Link to="/">Instagram</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border">
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
