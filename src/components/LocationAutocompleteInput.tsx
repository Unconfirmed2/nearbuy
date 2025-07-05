import React, { useEffect, useRef, forwardRef } from "react";
import { Input } from "@/components/ui/input";

interface LocationAutocompleteInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const LocationAutocompleteInput = forwardRef<HTMLInputElement, LocationAutocompleteInputProps>(
  ({ value, onChange, className, placeholder = "Enter your address", ...props }, forwardedRef) => {
    const internalRef = useRef<HTMLInputElement>(null);
    
    // Use forwarded ref if available, otherwise use internal ref
    const inputRef = forwardedRef || internalRef;

    useEffect(() => {
      const currentInput = (inputRef as React.RefObject<HTMLInputElement>)?.current;
      if (!currentInput) return;
      
      // Check if Google Maps is available
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        console.warn('Google Maps API not loaded');
        return;
      }
      
      const autocomplete = new window.google.maps.places.Autocomplete(currentInput, {
        types: ["geocode"],
        fields: ["formatted_address", "geometry"]
      });
      
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          onChange(place.formatted_address);
        }
      });
      
      return () => {
        if (window.google?.maps?.event) {
          window.google.maps.event.clearInstanceListeners(autocomplete);
        }
      };
    }, [onChange, inputRef]);

    return (
      <Input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={className}
        placeholder={placeholder}
        autoComplete="off"
        {...props}
      />
    );
  }
);

LocationAutocompleteInput.displayName = "LocationAutocompleteInput";

export default LocationAutocompleteInput;
