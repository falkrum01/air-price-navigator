interface FlightData {
  id: string;
  number: string;
  status: string;
  departure: {
    airport: string;
    time: string;
    terminal?: string;
    gate?: string;
  };
  arrival: {
    airport: string;
    time: string;
    terminal?: string;
    gate?: string;
  };
  airline: {
    name: string;
    logo: string;
  };
  aircraft?: string;
  delay?: number; // in minutes
}

export async function fetchFlights(origin: string, destination: string): Promise<FlightData[]> {
  try {
    // Note: In a production app, you would use the Flightradar24 API
    // This is a mock implementation that simulates the API response
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - in a real app, replace this with actual API call
    const mockFlights: FlightData[] = [
      {
        id: 'FR123',
        number: 'FR123',
        status: 'scheduled',
        departure: {
          airport: origin,
          time: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
          terminal: 'T1',
          gate: 'A12'
        },
        arrival: {
          airport: destination,
          time: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
          terminal: 'T2',
          gate: 'B5'
        },
        airline: {
          name: 'Air India',
          logo: 'https://www.flightradar24.com/static/images/airlines/small/AI.png'
        },
        aircraft: 'Boeing 787-8',
        delay: 15
      },
      {
        id: '6E456',
        number: '6E456',
        status: 'delayed',
        departure: {
          airport: origin,
          time: new Date(Date.now() + 5400000).toISOString(), // 1.5 hours from now
          terminal: 'T1',
          gate: 'A8'
        },
        arrival: {
          airport: destination,
          time: new Date(Date.now() + 9000000).toISOString(), // 2.5 hours from now
          terminal: 'T1',
          gate: 'A3'
        },
        airline: {
          name: 'IndiGo',
          logo: 'https://www.flightradar24.com/static/images/airlines/small/6E.png'
        },
        aircraft: 'Airbus A320',
        delay: 30
      },
      {
        id: 'UK789',
        number: 'UK789',
        status: 'on_time',
        departure: {
          airport: origin,
          time: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
          terminal: 'T2',
          gate: 'B2'
        },
        arrival: {
          airport: destination,
          time: new Date(Date.now() + 10800000).toISOString(), // 3 hours from now
          terminal: 'T2',
          gate: 'B8'
        },
        airline: {
          name: 'Vistara',
          logo: 'https://www.flightradar24.com/static/images/airlines/small/UK.png'
        },
        aircraft: 'Boeing 737-800'
      }
    ];

    return mockFlights;
  } catch (error) {
    console.error('Error fetching flight data:', error);
    return [];
  }
}

export async function fetchAirportDelays(airportCode: string): Promise<{
  totalFlights: number;
  delayedFlights: number;
  averageDelay: number;
  status: 'low' | 'medium' | 'high';
}> {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data - in a real app, replace this with actual API call
    const mockData = {
      totalFlights: Math.floor(Math.random() * 50) + 50, // 50-100 flights
      delayedFlights: Math.floor(Math.random() * 20) + 5, // 5-25 delayed flights
      averageDelay: Math.floor(Math.random() * 30) + 5, // 5-35 minutes
      status: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high'
    };
    
    return mockData;
  } catch (error) {
    console.error('Error fetching airport delay data:', error);
    return {
      totalFlights: 0,
      delayedFlights: 0,
      averageDelay: 0,
      status: 'low'
    };
  }
}
