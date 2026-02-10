
import React from 'react';
import { Garment } from '../types';

interface GarmentCatalogProps {
  garments: Garment[];
  selectedGarmentId: string | null;
  onSelect: (garment: Garment) => void;
}

const GarmentCatalog: React.FC<GarmentCatalogProps> = ({ garments, selectedGarmentId, onSelect }) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Store Catalog</h3>
          <p className="text-xs text-gray-400">Select an item to try on</p>
        </div>
        <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded font-bold uppercase">
          {garments.length} Items
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-2 max-h-[500px] custom-scrollbar">
        {garments.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`group relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all duration-300 ${
              selectedGarmentId === item.id 
                ? 'border-indigo-500 ring-4 ring-indigo-500/20 scale-[0.98]' 
                : 'border-transparent hover:border-white/20'
            }`}
          >
            <img 
              src={item.image.base64} 
              alt={item.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-tighter">{item.category}</p>
              <p className="text-xs text-white font-medium truncate">{item.name}</p>
            </div>
            {selectedGarmentId === item.id && (
              <div className="absolute top-2 right-2 bg-indigo-500 text-white rounded-full p-1 shadow-lg">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GarmentCatalog;
