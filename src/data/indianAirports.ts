
export interface Airport {
  code: string;
  iata_code: string;
  name: string;
  city: string;
}

export const indianAirports: Airport[] = [
  { code: "DEL", iata_code: "DEL", name: "Indira Gandhi International Airport", city: "Delhi" },
  { code: "BOM", iata_code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport", city: "Mumbai" },
  { code: "MAA", iata_code: "MAA", name: "Chennai International Airport", city: "Chennai" },
  { code: "BLR", iata_code: "BLR", name: "Kempegowda International Airport", city: "Bengaluru" },
  { code: "HYD", iata_code: "HYD", name: "Rajiv Gandhi International Airport", city: "Hyderabad" },
  { code: "CCU", iata_code: "CCU", name: "Netaji Subhas Chandra Bose International Airport", city: "Kolkata" },
  { code: "COK", iata_code: "COK", name: "Cochin International Airport", city: "Kochi" },
  { code: "AMD", iata_code: "AMD", name: "Sardar Vallabhbhai Patel International Airport", city: "Ahmedabad" },
  { code: "PNQ", iata_code: "PNQ", name: "Pune International Airport", city: "Pune" },
  { code: "GOI", iata_code: "GOI", name: "Goa International Airport", city: "Goa" },
  { code: "JAI", iata_code: "JAI", name: "Jaipur International Airport", city: "Jaipur" },
  { code: "LKO", iata_code: "LKO", name: "Chaudhary Charan Singh International Airport", city: "Lucknow" },
  { code: "IXC", iata_code: "IXC", name: "Chandigarh International Airport", city: "Chandigarh" },
  { code: "IXE", iata_code: "IXE", name: "Mangalore International Airport", city: "Mangalore" },
  { code: "GAU", iata_code: "GAU", name: "Lokpriya Gopinath Bordoloi International Airport", city: "Guwahati" },
  { code: "PAT", iata_code: "PAT", name: "Jay Prakash Narayan International Airport", city: "Patna" },
  { code: "IXB", iata_code: "IXB", name: "Bagdogra International Airport", city: "Siliguri" },
  { code: "BBI", iata_code: "BBI", name: "Biju Patnaik International Airport", city: "Bhubaneswar" },
  { code: "TRV", iata_code: "TRV", name: "Trivandrum International Airport", city: "Thiruvananthapuram" },
  { code: "VTZ", iata_code: "VTZ", name: "Visakhapatnam International Airport", city: "Visakhapatnam" }
];
