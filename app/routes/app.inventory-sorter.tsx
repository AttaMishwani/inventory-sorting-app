import { authenticate } from "app/shopify.server";
import {
  LoaderFunctionArgs,
  useLoaderData,
  ActionFunctionArgs,
  useActionData,
  useNavigation,
} from "react-router";
import { useState } from "react";
import { ProductNode, CollectionNode } from "app/types/inventory";
import {
  GetCollectionProducts,
  getCollections,
  reorderCollectionProducts
} from "app/services/collection.server";
import CollectionSelector from "app/components/collectionSelector";
import ProductsList from "app/components/productsList";
import { type SortMode, sortProducts } from "app/utils/sortProducts";
import { buildMoves } from "app/utils/buildMoves";

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
  const intent = String(formData.get("intent") || "load_collection");
  const shouldSortAndSave = intent === "sort_and_save";
  const sortMode = String(formData.get("sortMode") || "inventory_desc") as SortMode;

  if (!collectionId) {
    return { collectionProducts: [], reorderResult: null, intent };
  }

  const collectionProducts = await GetCollectionProducts(admin, collectionId);

 
  if (!shouldSortAndSave) {
    return { collectionProducts, reorderResult: null, intent };
  }

 
  const sortedProducts = sortProducts(collectionProducts, sortMode);
  const moves = buildMoves(sortedProducts);
  const reorderResult = await reorderCollectionProducts(admin, collectionId, moves);

  return { collectionProducts: sortedProducts, reorderResult, intent };
}

export default function InventorySorterPage() {
  const { collections } = useLoaderData() as { collections: CollectionNode[] };
  const actionData = useActionData() as
    | {
        collectionProducts: ProductNode[];
        reorderResult: unknown;
        intent: "load_collection" | "sort_and_save";
      }
    | undefined;

  const [selectedCollectionId, setSelectedCollectionId] = useState("");

  const sortOptions = [
    { label: "Inventory high to low", value: "inventory_desc" },
    { label: "Inventory low to high", value: "inventory_asc" },
    { label: "Out of stock first", value: "out_of_stock" }
  ];

  const [sortMode, setSortMode] = useState<SortMode>("inventory_desc");

  const collectionOptions = collections.map((collection) => ({
    label: collection.title,
    value: collection.id,
  }));


  const products = actionData?.collectionProducts;
  const displayedProducts = !products
    ? undefined
    : actionData.intent === "sort_and_save"
      ? sortProducts(products, sortMode)
      : products;


      const navigation = useNavigation();

      const isLoading = navigation.state === "loading" || navigation.state === "submitting";

  return (
    <s-page>
      <ui-title-bar title="Inventory-Sorter" />
      
        
          <CollectionSelector
            collectionOptions={collectionOptions}
            selectedCollectionId={selectedCollectionId}
            setSelectedCollectionId={setSelectedCollectionId}
            sortMode={sortMode}
            sortOptions={sortOptions}
            isLoading={isLoading}
            setSortMode={setSortMode}
          />

          {displayedProducts && (
            <ProductsList collectionProducts={displayedProducts} />
          )}
      
      
    </s-page>
  );
}
