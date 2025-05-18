
import React from "react";
import Layout from "@/components/Layout";
import FlightSearch from "@/components/FlightSearch";
import { Plane, Globe, IndianRupee, MapPin, Search, Calendar } from "lucide-react";

const Index: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section with Updated Design */}
      <div className="hero-pattern relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" alt="Sky background" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-r from-airblue/80 to-purple-700/60"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Discover <span className="text-yellow-300">India's Best Flight Deals</span> with SkyPredict
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8">
              Compare prices across popular Indian travel websites and predict price changes
              with accuracy powered by Amadeus AI technology.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 flex items-center">
                <Plane className="h-5 w-5 text-airblue mr-2" />
                <span className="text-gray-700 text-sm">All Indian Airlines</span>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 flex items-center">
                <IndianRupee className="h-5 w-5 text-airblue mr-2" />
                <span className="text-gray-700 text-sm">Best Price Guarantee</span>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 flex items-center">
                <Calendar className="h-5 w-5 text-airblue mr-2" />
                <span className="text-gray-700 text-sm">Seasonal Predictions</span>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 flex items-center">
                <Search className="h-5 w-5 text-airblue mr-2" />
                <span className="text-gray-700 text-sm">AI-Powered Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flight Search Section with Updated Visual */}
      <div className="py-8 md:py-12 bg-gray-50 relative">
        {/* Decorative background elements */}
        <div className="hidden md:block absolute top-0 right-0 w-40 h-40 bg-airblue/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="hidden md:block absolute bottom-0 left-0 w-64 h-64 bg-airblue/5 rounded-full translate-y-1/3 -translate-x-1/3"></div>
        
        <FlightSearch />

        {/* Airline Logos Section */}
        <div className="container mx-auto mt-12 px-4">
          <h3 className="text-center text-lg font-medium mb-6">Compare flights across major Indian airlines</h3>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 mb-8">
            <div className="flex flex-col items-center">
              <img 
                src="https://res.cloudinary.com/dbt3gghme/image/upload/b_rgb:FFFFFF/c_pad,w_40,h_40/v1747576681/maharaja_1633694839415_1633694844518_avgw7p.avif" 
                alt="Air India" 
                className="h-10 w-10 object-contain" 
              />
              <span className="text-xs text-gray-500 mt-2">Air India</span>
            </div>
            <div className="flex flex-col items-center">
              <img 
                src="https://res.cloudinary.com/dbt3gghme/image/upload/b_rgb:FFFFFF/c_pad,w_40,h_40/v1747576794/images_1_nvudlq.png" 
                alt="SpiceJet" 
                className="h-10 w-10 object-contain" 
              />
              <span className="text-xs text-gray-500 mt-2">SpiceJet</span>
            </div>
            <div className="flex flex-col items-center">
              <img 
                src="https://res.cloudinary.com/dbt3gghme/image/upload/b_rgb:FFFFFF/c_pad,w_40,h_40/v1747576214/download_1_e0pnur.png" 
                alt="Vistara" 
                className="h-10 w-10 object-contain" 
              />
              <span className="text-xs text-gray-500 mt-2">Vistara</span>
            </div>
            <div className="flex flex-col items-center">
              <img 
                src="https://res.cloudinary.com/dbt3gghme/image/upload/b_rgb:FFFFFF/c_pad,w_40,h_40/v1747576493/images_fosnmj.png" 
                alt="IndiGo" 
                className="h-10 w-10 object-contain" 
              />
              <span className="text-xs text-gray-500 mt-2">IndiGo</span>
            </div>
            <div className="flex flex-col items-center">
              <img 
                src="https://res.cloudinary.com/dbt3gghme/image/upload/c_pad,w_40,h_40/v1747575635/go-first.png_akas0s.jpg" 
                alt="GoAir" 
                className="h-10 w-10 object-contain" 
              />
              <span className="text-xs text-gray-500 mt-2">GoAir</span>
            </div>
          </div>

          <h3 className="text-center text-lg font-medium mb-6">Compare prices across travel websites</h3>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
            <div className="flex flex-col items-center">
              <img 
                src="https://res.cloudinary.com/dbt3gghme/image/upload/b_rgb:FFFFFF/c_pad,w_40,h_40/v1747576930/43eac1170112781.Y3JvcCwzODM1LDMwMDAsNzUwLDA_wrdlg3.png" 
                alt="Ixigo" 
                className="h-10 w-10 object-contain" 
              />
              <span className="text-xs text-gray-500 mt-2">Ixigo</span>
            </div>
            <div className="flex flex-col items-center">
              <img 
                src="https://res.cloudinary.com/dbt3gghme/image/upload/b_rgb:FFFFFF/c_pad,w_40,h_40/v1747577231/unnamed_wbrtbx.png" 
                alt="Paytm" 
                className="h-10 w-10 object-contain" 
              />
              <span className="text-xs text-gray-500 mt-2">Paytm</span>
            </div>
            <div className="flex flex-col items-center">
              <img 
                src="https://res.cloudinary.com/dbt3gghme/image/upload/b_rgb:FFFFFF/c_pad,w_40,h_40/v1747577359/makemytrip-logo-png_seeklogo-336111_dnlbuo.png" 
                alt="MakeMyTrip" 
                className="h-10 w-10 object-contain" 
              />
              <span className="text-xs text-gray-500 mt-2">MakeMyTrip</span>
            </div>
            <div className="flex flex-col items-center">
              <img 
                src="https://res.cloudinary.com/dbt3gghme/image/upload/b_rgb:FFFFFF/c_pad,w_40,h_40/v1747577533/og-goibibo.aba291ed_l3iqdv.png" 
                alt="Goibibo" 
                className="h-10 w-10 object-contain" 
              />
              <span className="text-xs text-gray-500 mt-2">Goibibo</span>
            </div>
            <div className="flex flex-col items-center">
              <img 
                src="https://res.cloudinary.com/dbt3gghme/image/upload/b_rgb:FFFFFF/c_pad,w_40,h_40/v1747577679/download_2_mu1xrr.png" 
                alt="Cleartrip" 
                className="h-10 w-10 object-contain" 
              />
              <span className="text-xs text-gray-500 mt-2">Cleartrip</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with Indian Icons */}
      <div className="py-16 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Why Travelers across <span className="text-airblue">India</span> Trust SkyPredict?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-airblue-light p-6 rounded-lg text-center relative overflow-hidden hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 w-20 h-20 bg-airblue/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm relative z-10">
                <Search className="h-8 w-8 text-airblue" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Price Comparison</h3>
              <p className="text-gray-700">
                Compare flights across MakeMyTrip, Cleartrip, Paytm, EaseMyTrip, Ixigo, Yatra and more in one search.
              </p>
            </div>
            
            <div className="bg-airblue-light p-6 rounded-lg text-center relative overflow-hidden hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 w-20 h-20 bg-airblue/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm relative z-10">
                <Calendar className="h-8 w-8 text-airblue" />
              </div>
              <h3 className="text-xl font-bold mb-2">Intelligent Predictions</h3>
              <p className="text-gray-700">
                Our algorithm, powered by Amadeus data, predicts future price changes for popular Indian routes.
              </p>
            </div>
            
            <div className="bg-airblue-light p-6 rounded-lg text-center relative overflow-hidden hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 w-20 h-20 bg-airblue/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm relative z-10">
                <MapPin className="h-8 w-8 text-airblue" />
              </div>
              <h3 className="text-xl font-bold mb-2">Festival Season Insights</h3>
              <p className="text-gray-700">
                Special predictions during Diwali, Holi, and other peak travel seasons when prices surge.
              </p>
            </div>
          </div>
          
          <div className="mt-16 bg-gradient-to-r from-airblue/10 to-purple-100 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <img alt="Indian travel" className="rounded-lg shadow-md w-full" src="https://images.unsplash.com/photo-1569154941061-e231b4725ef1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" />
              </div>
              <div className="md:w-2/3 md:pl-8">
                <h3 className="text-xl md:text-2xl font-bold mb-4">
                  Indian Flight Trends & Insights
                </h3>
                <p className="mb-4">
                  Our AI analyzes millions of flights across India to identify patterns in pricing. Whether you're flying during Diwali, planning a summer vacation in Goa, or booking a last-minute business trip to Bangalore, we've got you covered.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="bg-airblue text-white p-1 rounded-full mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>Save up to ₹5,000 on Delhi-Mumbai flights</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-airblue text-white p-1 rounded-full mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>Tuesday morning is the cheapest time to book domestic flights</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-airblue text-white p-1 rounded-full mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>Booking 4-5 weeks in advance offers the best prices</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section with Indian User Photos and Names */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            What Our Users Across India Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center mb-4">
                <img src="https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Priya Sharma" className="h-12 w-12 rounded-full object-cover border-2 border-airblue" />
                <div className="ml-4">
                  <h4 className="font-medium">Priya Sharma</h4>
                  <p className="text-sm text-gray-500">Mumbai</p>
                </div>
              </div>
              <div className="flex mb-3 text-yellow-400">
                {[...Array(5)].map((_, i) => <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>)}
              </div>
              <p className="text-gray-700">
                "SkyPredict saved me ₹4,500 on my Delhi-Bangalore flight for Diwali. The price prediction was perfectly accurate!"
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center mb-4">
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Vikram Singh" className="h-12 w-12 rounded-full object-cover border-2 border-airblue" />
                <div className="ml-4">
                  <h4 className="font-medium">Vikram Singh</h4>
                  <p className="text-sm text-gray-500">Hyderabad</p>
                </div>
              </div>
              <div className="flex mb-3 text-yellow-400">
                {[...Array(5)].map((_, i) => <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>)}
              </div>
              <p className="text-gray-700">
                "I travel weekly for business between Chennai and Kolkata. SkyPredict consistently finds me the best deals on IndiGo and Air India flights."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center mb-4">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Anjali Desai" className="h-12 w-12 rounded-full object-cover border-2 border-airblue" />
                <div className="ml-4">
                  <h4 className="font-medium">Anjali Desai</h4>
                  <p className="text-sm text-gray-500">Pune</p>
                </div>
              </div>
              <div className="flex mb-3 text-yellow-400">
                {[...Array(5)].map((_, i) => <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={i < 4 ? "currentColor" : "none"} stroke="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>)}
              </div>
              <p className="text-gray-700">
                "The festival season price alerts are so helpful. Booked my family's tickets for Goa vacation at just the right time thanks to SkyPredict!"
              </p>
            </div>
          </div>
          
          {/* Trust Badges */}
          <div className="mt-16">
            <h3 className="text-center text-lg font-medium mb-6">Trusted by travelers across India</h3>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="text-gray-400 flex items-center">
                <Plane className="h-5 w-5 mr-2" />
                <span>10M+ Searches</span>
              </div>
              <div className="text-gray-400 flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                <span>200+ Routes</span>
              </div>
              <div className="text-gray-400 flex items-center">
                <IndianRupee className="h-5 w-5 mr-2" />
                <span>₹100M+ Saved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
