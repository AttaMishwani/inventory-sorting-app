import { authenticate } from "app/shopify.server";
import {
  LoaderFunctionArgs,
  useLoaderData,
  ActionFunctionArgs,
  useActionData,
} from "react-router";
import { Page, Card, BlockStack } from "@shopify/polaris";
import { useState } from "react";
import { ProductNode, CollectionNode } from "app/types/inventory";
import {
  GetCollectionProducts,
  getCollections,
} from "app/services/collection.server";
import CollectionSelector from "app/components/collectionSelector";
import ProductsList from "app/components/productsList";

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

  const [selectedCollectionId, setSelectedCollectionId] = useState(
    collectionOptions[0]?.value || ""
  );

  return (
    <Page>
      <ui-title-bar title="Inventory-Sorter" />
      <Card>
        <BlockStack>
          <CollectionSelector
            collectionOptions={collectionOptions}
            selectedCollectionId={selectedCollectionId}
            setSelectedCollectionId={setSelectedCollectionId}
          />

          {actionData?.collectionProducts && (
            <ProductsList collectionProducts={actionData.collectionProducts} />
          )}

         
        </BlockStack>
      </Card>
    </Page>
  );
}