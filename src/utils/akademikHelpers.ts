import { AkademikMenuItem } from '../types';

export interface AkademikCategory {
  item: AkademikMenuItem;
  children: AkademikMenuItem[];
}

export interface AkademikTreeResult {
  categories: AkademikCategory[];
  standaloneItems: AkademikMenuItem[];
}

/** Apakah item merupakan kategori murni (parent null dan tidak memiliki link gdrive sendiri). */
export function isCategory(item: AkademikMenuItem): boolean {
  const hasNoParent = !item.parent_id || Number(item.parent_id) === 0;
  const hasDrive = item.link_gdrive && item.link_gdrive.trim() !== '';
  return hasNoParent && !hasDrive;
}

/** Daftar kategori murni (parent null & tanpa link gdrive) untuk dropdown pemilihan induk. */
export function getCategories(items: AkademikMenuItem[]): AkademikMenuItem[] {
  return items
    .filter((i) => isCategory(i))
    .sort((a, b) => a.urutan - b.urutan);
}

/** Kelompokkan item akademik menjadi struktur kategori -> anak, serta item mandiri (di luar kategori). */
export function buildAkademikTree(items: AkademikMenuItem[]): AkademikCategory[] {
  const pureCategories = items.filter((i) => isCategory(i));
  const children = items.filter((i) => i.parent_id && Number(i.parent_id) > 0);

  return pureCategories
    .sort((a, b) => a.urutan - b.urutan)
    .map((cat) => ({
      item: cat,
      children: children
        .filter((c) => Number(c.parent_id) === Number(cat.id))
        .sort((a, b) => a.urutan - b.urutan),
    }));
}

/** Dapatkan item mandiri (di luar kategori induk / memiliki link gdrive langsung tanpa parent). */
export function getStandaloneItems(items: AkademikMenuItem[]): AkademikMenuItem[] {
  return items
    .filter((i) => (!i.parent_id || Number(i.parent_id) === 0) && !isCategory(i))
    .sort((a, b) => a.urutan - b.urutan);
}
