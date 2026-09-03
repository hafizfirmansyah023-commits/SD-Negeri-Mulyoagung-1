import { AkademikMenuItem } from '../types';

export interface AkademikCategory {
  item: AkademikMenuItem;
  children: AkademikMenuItem[];
}

/** Kelompokkan item akademik menjadi struktur kategori -> anak. Item tanpa parent dianggap kategori (level-1). */
export function buildAkademikTree(items: AkademikMenuItem[]): AkademikCategory[] {
  const categories = items.filter((i) => !i.parent_id || Number(i.parent_id) === 0);
  const children = items.filter((i) => i.parent_id && Number(i.parent_id) > 0);

  return categories
    .sort((a, b) => a.urutan - b.urutan)
    .map((cat) => ({
      item: cat,
      children: children
        .filter((c) => Number(c.parent_id) === Number(cat.id))
        .sort((a, b) => a.urutan - b.urutan),
    }));
}

/** Daftar kategori (parent null) untuk dropdown pemilihan induk. */
export function getCategories(items: AkademikMenuItem[]): AkademikMenuItem[] {
  return items
    .filter((i) => !i.parent_id || Number(i.parent_id) === 0)
    .sort((a, b) => a.urutan - b.urutan);
}

/** Apakah item berupa kategori (parent null). */
export function isCategory(item: AkademikMenuItem): boolean {
  return !item.parent_id || Number(item.parent_id) === 0;
}
