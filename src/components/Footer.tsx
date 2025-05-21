import React from 'react';
import { Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-4 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
        <p className="flex items-center justify-center gap-1">
          Designed and maintained by{' '}
          <a 
            href="https://www.linkedin.com/in/mohammed-sohail-82176825b/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            Mohammed Sohail
            <Linkedin className="h-4 w-4" />
          </a>
        </p>
        <p className="mt-1">© {new Date().getFullYear()} AirPriceNavigator. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
