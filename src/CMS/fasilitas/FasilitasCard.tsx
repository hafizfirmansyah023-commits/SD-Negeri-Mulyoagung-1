import React from 'react';
import { Image as ImageIcon, Edit2, Trash2 } from 'lucide-react';
import { getImageUrl } from '../../config/api';
import { UserSession } from '../types';
import { FasilitasItem } from '../hooks/useFacilityData';
import { getFacilityIconByTitle } from '../FasilitasCrud';

interface FasilitasCardProps {
  fac: FasilitasItem;
  currentUser: UserSession;
  onEdit: (fac: FasilitasItem) => void;
  onDelete: (id: number) => void;
}

export const FasilitasCard: React.FC<FasilitasCardProps> = ({
  fac,
  currentUser,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="relative h-44 sm:h-48 w-full bg-slate-100 overflow-hidden">
          {fac.foto ? (
            <img
              src={getImageUrl(fac.foto)}
              alt={fac.judul}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <ImageIcon size={36} />
            </div>
          )}
          {/* Auto Icon Tag */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow border border-white/70 flex items-center gap-1.5 text-xs font-bold text-slate-700">
            {getFacilityIconByTitle(fac.judul)}
            <span>Icon Terdeteksi</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-2">
          <h3 className="font-bold text-slate-800 text-base sm:text-lg leading-tight line-clamp-1">{fac.judul}</h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2">
            {fac.deskripsi}
          </p>
        </div>
      </div>

      {currentUser.role === 'ADMIN' && (
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={() => onEdit(fac)}
            className="flex items-center gap-1.5 text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <Edit2 size={14} /> Ubah
          </button>
          <button
            onClick={() => onDelete(fac.id)}
            className="flex items-center gap-1.5 text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <Trash2 size={14} /> Hapus
          </button>
        </div>
      )}
    </div>
  );
};
