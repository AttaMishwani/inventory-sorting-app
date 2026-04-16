import { CollectionNode, ProductNode } from "app/types/inventory";

export async function getCollections(admin: any): Promise<CollectionNode[]> {
  const response = await admin.graphql(
    `
      #graphql
      query GetCollections {
        collections(first: 50, query: "collection_type:custom") {
          edges {
            node {
              id
              title
              sortOrder
            }
          }
        }
      }
    `
  );

  const json = await response.json();
  const collections: CollectionNode[] =
    json?.data?.collections?.edges?.map((edge: any) => edge.node) ?? [];
    console.log(collections);
  return collections;
}

export async function GetCollectionProducts(
  admin: any,
  collectionId: string
): Promise<ProductNode[]> {
  const response = await admin.graphql(
    `
      
      query GetCollectionProducts($id: ID!) {
        collection(id: $id) {
          id
          title
          products(first: 50) {
            edges {
              node {
                id
                title
                totalInventory
                featuredImage{
                url
                altText
                }
              }
            }
          }
        }
      }
    `,
    {
      variables: {
        id: collectionId,
      },
    }
  );

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));

  const collectionProducts: ProductNode[] =
    data?.data?.collection?.products?.edges?.map((edge: any) => edge.node) || [];

  return collectionProducts;
}

export function sortCollectionProducts (Products :  ProductNode[] , sortMode : string) :ProductNode[] {
 const sortedProducts = Products ?    [...Products].sort((a, b) => {
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
      })
    : [];

    return sortedProducts
}

export async function reorderCollectionProducts(
  admin: any,
  collectionId: string,
  moves: { id: string; newPosition: string }[],
) {

  const response  = await admin.graphql(
    `
    #graphql 
    mutation collectionReorderProducts($id:ID! , $moves : [MoveInput!]!){
    collectionReorderProducts(id:$id , moves:$moves){
    job{
    id
    }
    userErrors{
    field
    message
    }
    }
    }
    `,
    {
      variables: {
        id: collectionId,
        moves,
      }
    }
  )

  const data = await response.json();
  console.log(data)
  return data?.data
}