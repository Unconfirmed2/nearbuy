import React, { useEffect, useRef, forwardRef, useState } from "react";
import { Input } from "@/components/ui/input";

interface LocationAutocompleteInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  onFavoriteClick?: () => void;
}

const LOCATION_KEY = 'nearbuy_location';

declare global {
  interface Window {
    google: any;
  }
}

const LocationAutocompleteInput = forwardRef<HTMLInputElement, LocationAutocompleteInputProps>(
  ({ value, onChange, className, placeholder = "Enter your address", onFavoriteClick, ...props }, forwardedRef) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<any>(null);
    const [internalValue, setInternalValue] = useState<string>("");
    const [predictions, setPredictions] = useState<any[]>([]);
    const [showPredictions, setShowPredictions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Initialize from localStorage on mount
    useEffect(() => {
      if (value === undefined) {
        const stored = localStorage.getItem(LOCATION_KEY);
        if (stored) {
          setInternalValue(stored);
          onChange(stored);
        }
      }
    }, []);

    // Save to localStorage whenever value changes
    useEffect(() => {
      const val = value !== undefined ? value : internalValue;
      if (val) {
        localStorage.setItem(LOCATION_KEY, val);
      }
    }, [value, internalValue]);

    // Initialize Google Places Autocomplete Service
    useEffect(() => {
      if (typeof window !== 'undefined' && window.google && window.google.maps) {
        try {
          autocompleteRef.current = new window.google.maps.places.AutocompleteService();
        } catch (error) {
          console.log('Google Places AutocompleteService not available');
        }
      }
    }, []);

    // Handle input changes and fetch predictions
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      if (value === undefined) setInternalValue(inputValue);
      onChange(inputValue);

      if (!autocompleteRef.current || inputValue.length < 2) {
        setPredictions([]);
        setShowPredictions(false);
        return;
      }

      setIsLoading(true);
      autocompleteRef.current.getPlacePredictions(
        {
          input: inputValue,
          types: ['geocode'],
        },
        (predictions: any[], status: any) => {
          setIsLoading(false);
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setPredictions(predictions.slice(0, 5)); // Limit to 5 suggestions
            setShowPredictions(true);
          } else {
            setPredictions([]);
            setShowPredictions(false);
          }
        }
      );
    };

    // Handle prediction selection
    const handlePredictionSelect = (prediction: any) => {
      if (value === undefined) setInternalValue(prediction.description);
      onChange(prediction.description);
      setPredictions([]);
      setShowPredictions(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    };

    // Handle input blur with delay to allow prediction clicks
    const handleBlur = () => {
      setTimeout(() => {
        setShowPredictions(false);
      }, 150);
    };

    // Handle input focus
    const handleFocus = () => {
      if (predictions.length > 0) {
        setShowPredictions(true);
      }
    };

    const inputValue = value !== undefined ? value : internalValue;

    return (
      <div className="relative w-full">
        <Input
          ref={node => {
            inputRef.current = node;
            if (typeof forwardedRef === 'function') forwardedRef(node);
            else if (forwardedRef) forwardedRef.current = node;
          }}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={className}
          placeholder={placeholder}
          autoComplete="off"
          {...props}
        />
        {/* Favorite button */}
        {onFavoriteClick && (
          <button
            type="button"
            onClick={onFavoriteClick}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-white rounded-full hover:bg-gray-100 border border-gray-200 shadow"
            tabIndex={-1}
            aria-label="Use favorite address"
            style={{ zIndex: 60 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5 text-yellow-400">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
            </svg>
          </button>
        )}
        {/* Predictions dropdown */}
        {showPredictions && predictions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
            {predictions.map((prediction, index) => (
              <div
                key={prediction.place_id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handlePredictionSelect(prediction)}
              >
                <div className="text-sm font-medium text-gray-900">
                  {prediction.structured_formatting?.main_text || prediction.description}
                </div>
                {prediction.structured_formatting?.secondary_text && (
                  <div className="text-xs text-gray-500">
                    {prediction.structured_formatting.secondary_text}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    );
  }
);

LocationAutocompleteInput.displayName = "LocationAutocompleteInput";

export default LocationAutocompleteInput;
