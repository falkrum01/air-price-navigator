
import React from "react";
import Layout from "@/components/Layout";
import FlightSearch from "@/components/FlightSearch";

const Index: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="hero-pattern py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Find the <span className="gradient-text">Perfect Time</span> to Book Your Flight
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Compare prices across multiple websites and predict future price changes
              to get the best deal on your airfare.
            </p>
          </div>
        </div>
      </div>

      {/* Flight Search Section */}
      <div className="py-8 md:py-12 bg-gray-50">
        <FlightSearch />
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Why Use SkyPredict?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-airblue-light p-6 rounded-lg text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-airblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Price Comparison</h3>
              <p className="text-gray-700">
                Compare prices from multiple booking sites to find the best deal instantly.
              </p>
            </div>
            
            <div className="bg-airblue-light p-6 rounded-lg text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-airblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Price Prediction</h3>
              <p className="text-gray-700">
                Our algorithm predicts future price changes to help you book at the perfect time.
              </p>
            </div>
            
            <div className="bg-airblue-light p-6 rounded-lg text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-airblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Real-Time Updates</h3>
              <p className="text-gray-700">
                Get notifications when prices drop or are about to increase for your tracked routes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div className="ml-4">
                  <h4 className="font-medium">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500">Frequent Traveler</p>
                </div>
              </div>
              <p className="text-gray-700">
                "SkyPredict saved me over $300 on my last international flight. The price prediction was spot on!"
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div className="ml-4">
                  <h4 className="font-medium">Michael Chen</h4>
                  <p className="text-sm text-gray-500">Business Traveler</p>
                </div>
              </div>
              <p className="text-gray-700">
                "I use this app for all my business trips now. The comparison feature makes finding the best deal effortless."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div className="ml-4">
                  <h4 className="font-medium">Emma Rodriguez</h4>
                  <p className="text-sm text-gray-500">Budget Traveler</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The price predictions helped me book my vacation at exactly the right time. Highly recommended!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
