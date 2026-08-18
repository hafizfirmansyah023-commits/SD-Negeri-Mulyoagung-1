import React from 'react';
import { Share2, Plus, Edit2, Trash2 } from 'lucide-react';
import { MedsosItem } from '../types';
import { SocialMediaIcon } from '../../../components/common/SocialMediaIcon';

interface MedsosSectionProps {
  medsosList: MedsosItem[];
  onAdd: () => void;
  onEdit: (item: MedsosItem) => void;
  onDelete: (id: string) => void;
}

export const MedsosSection: React.FC<MedsosSectionProps> = ({
  medsosList,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Share2 className="w-5 h-5 text-teal-600" />
            Kelola Tautan Media Sosial
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Media sosial ini akan muncul pada Footer dan Halaman Kontak. Icon dapat ditentukan secara otomatis berdasarkan nama platform atau dipilih manual.
          </p>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Tambah Media Sosial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {medsosList.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-3 shadow-2xs transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <SocialMediaIcon
                name={item.name}
                icon={item.icon}
                className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm"
                iconClassName="w-5 h-5"
              />
              <div className="min-w-0">
                <div className="font-bold text-sm text-slate-800 truncate">{item.name}</div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-teal-600 hover:underline truncate block max-w-[180px]"
                >
                  {item.url}
                </a>
                <span className="text-[10px] text-slate-400 font-medium">
                  Icon: {item.icon === 'auto' ? 'Otomatis' : item.icon}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onEdit(item)}
                className="p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                title="Edit"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Hapus"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {medsosList.length === 0 && (
          <div className="col-span-full py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p className="text-sm text-slate-500 font-semibold">Belum ada media sosial yang ditambahkan.</p>
          </div>
        )}
      </div>
    </div>
  );
};
