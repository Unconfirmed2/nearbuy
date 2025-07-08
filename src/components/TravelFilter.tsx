import React from "react";

export type TravelMode = "walking" | "driving" | "biking" | "transit";
export type FilterType = "time" | "distance";

export interface TravelFilterValue {
  mode: TravelMode;
  type: FilterType;
  value: number;
}

interface TravelFilterProps {
  value: TravelFilterValue;
  onChange: (value: TravelFilterValue) => void;
  unit?: 'km' | 'mi';
}

const TravelFilter: React.FC<TravelFilterProps> = ({ value, onChange, unit = 'km' }) => {
  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...value, mode: e.target.value as TravelMode });
  };
  const handleTypeToggle = (type: FilterType) => {
    onChange({ ...value, type });
  };
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    // Prevent leading zero
    if (val.length > 1 && val.startsWith('0')) val = val.replace(/^0+/, '');
    // If empty, treat as 1
    const num = val === '' ? 1 : Number(val);
    onChange({ ...value, value: num });
  };

  // Slider min/max
  const min = 1;
  const max = value.type === "time" ? 120 : 50;

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow px-2 py-1 border border-gray-200">
      {/* Toggle */}
      <div className="flex items-center bg-gray-100 rounded-md overflow-hidden mr-2">
        <button
          className={`px-2 py-1 text-xs font-medium ${value.type === "distance" ? "bg-blue-600 text-white" : "text-gray-700"}`}
          onClick={() => handleTypeToggle("distance")}
          type="button"
        >
          Distance
        </button>
        <button
          className={`px-2 py-1 text-xs font-medium ${value.type === "time" ? "bg-blue-600 text-white" : "text-gray-700"}`}
          onClick={() => handleTypeToggle("time")}
          type="button"
        >
          Time
        </button>
      </div>
      {/* Value input and slider */}
      <input
        type="text"
        min={min}
        max={max}
        value={value.value}
        onChange={handleValueChange}
        className="w-10 text-xs px-1 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-center no-spinners"
        aria-label={value.type === "time" ? "Max Time (min)" : `Max Distance (${unit})`}
        inputMode="numeric"
        pattern="[1-9][0-9]*"
        style={{ MozAppearance: 'textfield' }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={value.value}
        onChange={handleValueChange}
        className="w-24 mx-1 accent-blue-600"
        aria-label={value.type === "time" ? "Max Time (min)" : `Max Distance (${unit})`}
      />
      <span className="w-5 text-xs text-gray-600 mr-2">
        {value.type === "time" ? "min" : unit}
      </span>
      {/* Mode select */}
      <select
        value={value.mode}
        onChange={handleModeChange}
        className="text-xs px-1 py-1 border rounded bg-white"
        aria-label="Mode of transport"
      >
        <option value="walking">🚶‍♂️ Walk</option>
        <option value="driving">🚗 Drive</option>
        <option value="biking">🚲 Bike</option>
        <option value="transit">🚌 Transit</option>
      </select>
    </div>
  );
};

export default TravelFilter;
