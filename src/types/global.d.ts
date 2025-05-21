declare global {
  interface Window {
    google: {
      maps: {
        Map: new (mapDiv: HTMLElement, options?: google.maps.MapOptions) => google.maps.Map;
        LatLng: new (lat: number, lng: number) => google.maps.LatLng;
        LatLngBounds: new () => google.maps.LatLngBounds;
        Marker: new (options?: google.maps.MarkerOptions) => google.maps.Marker;
        Animation: {
          DROP: number;
          BOUNCE: number;
        };
        Size: new (width: number, height: number) => google.maps.Size;
        TrafficLayer: new () => google.maps.TrafficLayer;
        DirectionsService: new () => google.maps.DirectionsService;
        DirectionsRenderer: new (options?: google.maps.DirectionsRendererOptions) => google.maps.DirectionsRenderer;
        places: {
          AutocompleteService: new () => google.maps.places.AutocompleteService;
          Autocomplete: new (inputField: HTMLInputElement, options?: google.maps.places.AutocompleteOptions) => google.maps.places.Autocomplete;
        };
        event: {
          addListener: <T extends object>(
            instance: T, 
            eventName: string, 
            handler: (this: T, ...args: unknown[]) => void
          ) => google.maps.MapsEventListener;
          removeListener: (listener: google.maps.MapsEventListener) => void;
        };
        Geocoder: new () => google.maps.Geocoder;
        TravelMode: {
          DRIVING: google.maps.TravelMode;
          WALKING: google.maps.TravelMode;
          BICYCLING: google.maps.TravelMode;
          TRANSIT: google.maps.TravelMode;
        };
      };
    };
  }
}

export {};
