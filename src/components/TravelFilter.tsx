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
}

const TravelFilter: React.FC<TravelFilterProps> = ({ value, onChange }) => {
  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...value, mode: e.target.value as TravelMode });
  };
  const handleTypeToggle = (type: FilterType) => {
    onChange({ ...value, type });
  };
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, value: Number(e.target.value) });
  };

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
      {/* Value input */}
      <input
        type="number"
        min={1}
        value={value.value}
        onChange={handleValueChange}
        className="w-14 text-xs px-1 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label={value.type === "time" ? "Max Time (min)" : "Max Distance (km)"}
      />
      <span className="text-xs text-gray-600 mr-2">
        {value.type === "time" ? "min" : "km"}
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
