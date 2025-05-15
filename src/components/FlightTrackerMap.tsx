
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { toast } from '@/components/ui/use-toast';

// Define interfaces for the component props
interface Flight {
  icao24: string;
  callsign: string;
  longitude: number;
  latitude: number;
  baro_altitude: number;
  true_track: number;
  on_ground: boolean;
  airline?: string;
}

interface FlightTrackerMapProps {
  flights: Flight[];
  selectedFlight: Flight | null;
  onSelectFlight: (flight: Flight) => void;
}

const FlightTrackerMap: React.FC<FlightTrackerMapProps> = ({ flights, selectedFlight, onSelectFlight }) => {
  // Create references to hold the canvas and three.js objects
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const flightMarkersRef = useRef<{ [key: string]: THREE.Mesh }>({});
  const earthRef = useRef<THREE.Mesh | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  
  // Load earth texture and initialize the scene
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    try {
      // Initialize Three.js scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      
      // Set up camera
      const camera = new THREE.PerspectiveCamera(
        45, 
        mapContainerRef.current.clientWidth / mapContainerRef.current.clientHeight, 
        0.1, 
        1000
      );
      camera.position.z = 2.5;
      cameraRef.current = camera;
      
      // Set up renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(mapContainerRef.current.clientWidth, mapContainerRef.current.clientHeight);
      renderer.setClearColor(0xf0f0f0);
      mapContainerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;
      
      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0x404040, 2);
      scene.add(ambientLight);
      
      // Add directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 3, 5);
      scene.add(directionalLight);
      
      // Create Earth
      const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
      
      // We'll use a basic material with a blue color for Earth
      const earthMaterial = new THREE.MeshPhongMaterial({
        color: 0x2233aa,
        emissive: 0x112244,
        specular: 0x333333,
        shininess: 25,
        opacity: 0.9,
        transparent: true
      });
      
      const earth = new THREE.Mesh(earthGeometry, earthMaterial);
      scene.add(earth);
      earthRef.current = earth;
      
      // Add a wireframe to the earth for visual reference
      const wireframeGeometry = new THREE.SphereGeometry(1.001, 32, 32);
      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.1
      });
      const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
      scene.add(wireframe);
      
      // Utility function for converting lat/long to 3D coordinates
      const latLongToVector3 = (lat: number, lon: number, radius: number = 1) => {
        const phi = (90 - lat) * Math.PI / 180;
        const theta = (lon + 180) * Math.PI / 180;
        
        const x = -radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        
        return new THREE.Vector3(x, y, z);
      };
      
      // Handle window resize
      const handleResize = () => {
        if (!mapContainerRef.current || !cameraRef.current || !rendererRef.current) return;
        
        cameraRef.current.aspect = mapContainerRef.current.clientWidth / mapContainerRef.current.clientHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(mapContainerRef.current.clientWidth, mapContainerRef.current.clientHeight);
      };
      
      window.addEventListener('resize', handleResize);
      
      // Handle mouse events for flight selection
      const handleMouseMove = (event: MouseEvent) => {
        if (!mapContainerRef.current) return;
        
        const rect = mapContainerRef.current.getBoundingClientRect();
        
        mouseRef.current.x = ((event.clientX - rect.left) / mapContainerRef.current.clientWidth) * 2 - 1;
        mouseRef.current.y = -((event.clientY - rect.top) / mapContainerRef.current.clientHeight) * 2 + 1;
      };
      
      const handleMouseClick = () => {
        if (!sceneRef.current || !cameraRef.current) return;
        
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        
        // Find intersections with flight markers
        const allFlightMarkers = Object.values(flightMarkersRef.current);
        const intersects = raycasterRef.current.intersectObjects(allFlightMarkers);
        
        if (intersects.length > 0) {
          const flightId = intersects[0].object.userData.flightId;
          const flight = flights.find(f => f.icao24 === flightId);
          
          if (flight) {
            onSelectFlight(flight);
          }
        }
      };
      
      mapContainerRef.current.addEventListener('mousemove', handleMouseMove);
      mapContainerRef.current.addEventListener('click', handleMouseClick);
      
      // Animation loop
      let animationFrameId: number;
      
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        
        // Slowly rotate the earth
        if (earthRef.current) {
          earthRef.current.rotation.y += 0.0005;
        }
        
        // Render the scene
        if (sceneRef.current && cameraRef.current && rendererRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      };
      
      animate();
      
      // Clean up on unmount
      return () => {
        window.removeEventListener('resize', handleResize);
        
        if (mapContainerRef.current) {
          mapContainerRef.current.removeEventListener('mousemove', handleMouseMove);
          mapContainerRef.current.removeEventListener('click', handleMouseClick);
          mapContainerRef.current.innerHTML = '';
        }
        
        cancelAnimationFrame(animationFrameId);
        
        // Dispose of geometries and materials
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
        
        renderer.dispose();
      };
    } catch (error) {
      console.error("Error initializing 3D scene:", error);
      toast({
        title: "Error",
        description: "Failed to initialize the flight tracker. Please try refreshing the page.",
        variant: "destructive"
      });
    }
  }, []);
  
  // Update flight positions when flights change
  useEffect(() => {
    if (!sceneRef.current || flights.length === 0) return;
    
    const flightMarkers = flightMarkersRef.current;
    const scene = sceneRef.current;
    
    // Convert latitude and longitude to 3D position
    const latLongToVector3 = (lat: number, lon: number, altitude: number = 0) => {
      // Add a small amount to the radius based on altitude (scaled for visualization)
      const radius = 1 + (altitude / 40000) * 0.1;
      
      const phi = (90 - lat) * Math.PI / 180;
      const theta = (lon + 180) * Math.PI / 180;
      
      const x = -radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      
      return new THREE.Vector3(x, y, z);
    };
    
    // Create or update flight markers
    flights.forEach(flight => {
      const position = latLongToVector3(
        flight.latitude, 
        flight.longitude, 
        flight.on_ground ? 0 : flight.baro_altitude
      );
      
      if (flightMarkers[flight.icao24]) {
        // Update existing marker
        flightMarkers[flight.icao24].position.copy(position);
        
        // Update rotation based on true track
        const radians = (flight.true_track * Math.PI) / 180;
        flightMarkers[flight.icao24].rotation.set(0, -radians, 0);
        
        // Highlight selected flight
        const material = flightMarkers[flight.icao24].material as THREE.MeshBasicMaterial;
        if (selectedFlight && selectedFlight.icao24 === flight.icao24) {
          material.color.set(0xff0000); // Red for selected flight
          material.opacity = 1;
        } else {
          material.color.set(0xffaa00); // Orange for regular flights
          material.opacity = 0.8;
        }
      } else {
        // Create new marker
        // For simplicity, use a cone shape for the aircraft
        const geometry = new THREE.ConeGeometry(0.01, 0.03, 4);
        const material = new THREE.MeshBasicMaterial({
          color: selectedFlight && selectedFlight.icao24 === flight.icao24 ? 0xff0000 : 0xffaa00,
          transparent: true,
          opacity: 0.8
        });
        
        const marker = new THREE.Mesh(geometry, material);
        marker.position.copy(position);
        
        // Rotate to point in the direction of travel
        const radians = (flight.true_track * Math.PI) / 180;
        marker.rotation.set(0, -radians, 0);
        
        // Store the flight ID for raycasting
        marker.userData = { flightId: flight.icao24 };
        
        scene.add(marker);
        flightMarkers[flight.icao24] = marker;
      }
    });
    
    // Remove markers for flights that are no longer in the data
    const currentFlightIds = flights.map(f => f.icao24);
    Object.keys(flightMarkers).forEach(id => {
      if (!currentFlightIds.includes(id)) {
        scene.remove(flightMarkers[id]);
        delete flightMarkers[id];
      }
    });
  }, [flights, selectedFlight, onSelectFlight]);
  
  return (
    <div ref={mapContainerRef} className="w-full h-full"></div>
  );
};

export default FlightTrackerMap;
