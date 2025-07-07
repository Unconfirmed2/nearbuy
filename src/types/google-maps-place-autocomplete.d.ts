// TypeScript declaration for Google Maps PlaceAutocompleteElement web component
import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gmpx-place-autocomplete': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: string;
        placeholder?: string;
        class?: string;
      };
    }
  }
}
