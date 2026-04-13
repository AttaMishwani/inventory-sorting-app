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
  return collections;
}

export async function GetCollectionProducts(
  admin: any,
  collectionId: string
): Promise<ProductNode[]> {
  const response = await admin.graphql(
    `
      #graphql
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

  const collectionProducts: ProductNode[] =
    data?.data?.collection?.products?.edges?.map((edge: any) => edge.node) || [];

  return collectionProducts;
}