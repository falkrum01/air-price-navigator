import React from "react";
import Layout from "@/components/Layout";
import FlightTrackerComponent from "@/components/FlightTracker";

const FlightTracker: React.FC = () => {
  return (
    <Layout>
      <FlightTrackerComponent />
    </Layout>
  );
};

export default FlightTracker;
