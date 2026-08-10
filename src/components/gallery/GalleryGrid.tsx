import React from 'react';
import { GalleryItem } from '../../types';
import { GalleryCard } from './GalleryCard';

interface GalleryGridProps {
  items: GalleryItem[];
  onSelectPhoto: (item: GalleryItem) => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ items, onSelectPhoto }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.map((item) => (
      <GalleryCard key={item.id} item={item} onClick={onSelectPhoto} />
    ))}
  </div>
);
