
declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
    class Geocoder {
      geocode(
        request: google.maps.GeocoderRequest,
        callback: (
          results: google.maps.GeocoderResult[] | null,
          status: google.maps.GeocoderStatus
        ) => void
      ): void;
    }

    interface GeocoderRequest {
      location?: google.maps.LatLng | google.maps.LatLngLiteral;
      address?: string;
    }

    interface GeocoderResult {
      formatted_address: string;
      geometry: {
        location: google.maps.LatLng;
      };
    }

    enum GeocoderStatus {
      OK = 'OK',
      ZERO_RESULTS = 'ZERO_RESULTS',
      OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
      REQUEST_DENIED = 'REQUEST_DENIED',
      INVALID_REQUEST = 'INVALID_REQUEST',
      UNKNOWN_ERROR = 'UNKNOWN_ERROR'
    }

    class LatLng {
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    namespace places {
      class Autocomplete {
        constructor(
          input: HTMLInputElement,
          options?: google.maps.places.AutocompleteOptions
        );
        addListener(eventName: string, handler: Function): void;
        getPlace(): google.maps.places.PlaceResult;
      }

      interface AutocompleteOptions {
        types?: string[];
        fields?: string[];
      }

      interface PlaceResult {
        formatted_address?: string;
        geometry?: {
          location?: google.maps.LatLng;
        };
      }
    }

    namespace event {
      function clearInstanceListeners(instance: any): void;
    }
  }
}

export {};
