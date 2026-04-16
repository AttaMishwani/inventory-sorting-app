import { ProductNode } from "app/types/inventory";


export function buildMoves(sortedProducts: ProductNode[]) {
  return sortedProducts.map((product, index) => ({
    id: product.id,
    newPosition: String(index),
  }));
}