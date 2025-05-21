import React from "react";
import Layout from "@/components/Layout";
import HotelSearch from "@/components/HotelSearch";

const Hostels: React.FC = () => {
  return (
    <Layout>
      {/* We're using the same HotelSearch component but it will filter for hostels */}
      <HotelSearch />
    </Layout>
  );
};

export default Hostels;
