import type { ProductNode } from "app/types/inventory";

export type SortMode = "inventory_desc" | "inventory_asc" | "out_of_stock";

export function sortProducts(
  products: ProductNode[],
  sortMode: SortMode
): ProductNode[] {
  return [...products].sort((a, b) => {
    const invA = a.totalInventory ?? 0;
    const invB = b.totalInventory ?? 0;

    if (sortMode === "inventory_desc") {
      return invB - invA;
    }

    if (sortMode === "inventory_asc") {
      return invA - invB;
    }

    if (sortMode === "out_of_stock") {
      if (invA === 0 && invB !== 0) return -1;
      if (invA !== 0 && invB === 0) return 1;
      return 0;
    }

    return 0;
  });
}