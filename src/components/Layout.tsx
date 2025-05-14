
import React from "react";
import { Link } from "react-router-dom";
import { Plane } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-airblue p-1.5 rounded-md">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">SkyPredict</span>
          </Link>
          <div className="ml-auto flex items-center space-x-4">
            <Link to="/" className="text-sm font-medium hover:text-airblue">
              Find Flights
            </Link>
            <Link to="/" className="text-sm font-medium hover:text-airblue">
              My Trips
            </Link>
            <Link to="/" className="text-sm font-medium hover:text-airblue">
              Help
            </Link>
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
              <h3 className="font-semibold mb-4">Help & Support</h3>
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
