import { authenticate } from "app/shopify.server";
import {
  LoaderFunctionArgs,
  useLoaderData,
  ActionFunctionArgs,
  useActionData,
} from "react-router";
import { Page, Card, BlockStack, Select } from "@shopify/polaris";
import { useState } from "react";
import { ProductNode, CollectionNode } from "app/types/inventory";
import {
  GetCollectionProducts,
  getCollections
} from "app/services/collection.server";
import CollectionSelector from "app/components/collectionSelector";
import ProductsList from "app/components/productsList";
import { type SortMode, sortProducts } from "app/utils/sortProducts";


// loader function to fetch collections
export async function loader({ request }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);
  const collections = await getCollections(admin);
  return { collections };
}

// action function
export async function action({ request }: ActionFunctionArgs) {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const collectionId = String(formData.get("collectionId") || "");
  const collectionProducts = await GetCollectionProducts(admin, collectionId);
  return { collectionProducts };
}

export default function InventorySorterPage() {
  const { collections } = useLoaderData() as { collections: CollectionNode[] };
  const actionData = useActionData() as
    | { collectionProducts: ProductNode[] }
    | undefined;

    console.log(actionData);
    console.log(actionData?.collectionProducts);

  const collectionOptions = collections.map((collection) => ({
    label: collection.title,
    value: collection.id,
  }));

  const sortOptions = [
    {label : "Inventory high to low" , value:"inventory_desc"},
    {label:"Inventory low to high" , value:"inventory_asc"},
    {label:"Out of stock first" ,value :"out_of_stock"}
  ]

  const [selectedCollectionId, setSelectedCollectionId] = useState(
    collectionOptions[0]?.value || ""
  );

  const [sortMode, setSortMode] = useState<SortMode>("inventory_desc");
  const sortedProducts = actionData?.collectionProducts
  ? sortProducts(actionData.collectionProducts, sortMode)
  : [];
 
  
  return (
    <Page>
      <ui-title-bar title="Inventory-Sorter" />
      <Card>
  <BlockStack gap="400">
    <CollectionSelector
      collectionOptions={collectionOptions}
      selectedCollectionId={selectedCollectionId}
      setSelectedCollectionId={setSelectedCollectionId}
    />

    {actionData?.collectionProducts && (
      <Select
        label="Sort products"
        options={sortOptions}
        value={sortMode}
        onChange={(value) => setSortMode(value as SortMode)}
      />
    )}

    {actionData?.collectionProducts && (
      <ProductsList collectionProducts={sortedProducts} />
    )}
  </BlockStack>
</Card>
    </Page>
  );
}