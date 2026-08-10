import React from 'react';
import { Teacher } from '../../types';
import { CATEGORY_GROUPS } from '../../utils/directoryHelpers';
import { TeacherCard } from './TeacherCard';

interface DirectoryContentProps {
  filteredTeachers: Teacher[];
  roleFilter: string;
  searchTerm: string;
  onTeacherClick: (teacher: Teacher) => void;
}

export const DirectoryContent: React.FC<DirectoryContentProps> = ({
  filteredTeachers,
  roleFilter,
  searchTerm,
  onTeacherClick,
}) => {
  if (roleFilter === 'Semua') {
    const allAssignedRoles = CATEGORY_GROUPS.flatMap((g) => g.roles);
    const otherTeachers = filteredTeachers.filter((t) => !allAssignedRoles.includes(t.role));

    return (
      <div className="space-y-10">
        {CATEGORY_GROUPS.map((group) => {
          const groupTeachers = filteredTeachers.filter((t) => group.roles.includes(t.role));
          if (groupTeachers.length === 0) return null;

          return (
            <div key={group.title} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-teal-100 pb-2">
                <span className="w-2.5 h-6 bg-[#028C84] rounded-full" />
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#1E3A8A]">{group.title}</h3>
                <span className="text-xs font-bold text-[#028C84] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/80">
                  {groupTeachers.length}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupTeachers.map((teacher) => (
                  <TeacherCard key={teacher.id} teacher={teacher} onClick={onTeacherClick} />
                ))}
              </div>
            </div>
          );
        })}

        {otherTeachers.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-teal-100 pb-2">
              <span className="w-2.5 h-6 bg-slate-400 rounded-full" />
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1E3A8A]">Lainnya</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherTeachers.map((teacher) => (
                <TeacherCard key={teacher.id} teacher={teacher} onClick={onTeacherClick} />
              ))}
            </div>
          </div>
        )}

        {filteredTeachers.length === 0 && (
          <EmptyState searchTerm={searchTerm} />
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <TeacherCard key={teacher.id} teacher={teacher} onClick={onTeacherClick} />
        ))}
      </div>

      {filteredTeachers.length === 0 && <EmptyState searchTerm={searchTerm} />}
    </>
  );
};

const EmptyState: React.FC<{ searchTerm: string }> = ({ searchTerm }) => (
  <div className="text-center py-12 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/80 p-8 shadow-sm">
    <p className="text-slate-500 text-sm font-semibold">
      Tidak ada data guru yang cocok dengan pencarian "{searchTerm}".
    </p>
  </div>
);
