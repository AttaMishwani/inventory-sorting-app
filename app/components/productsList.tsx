import { BlockStack, Card, Text } from "@shopify/polaris";
import { ProductNode } from "app/types/inventory";

type ProductsListProps = {
  collectionProducts: ProductNode[];
};

export default function ProductsList({ collectionProducts }: ProductsListProps) {
  return (
    <BlockStack>
      <Text as="h3" variant="headingSm">
        Collection Products
      </Text>
      {/* Add gap between product cards */}
      <BlockStack gap="400">
        {collectionProducts.map((product) => (
          <Card key={product.id}>
            <BlockStack gap="400">
              <Text as="h4" variant="headingSm">
                {product.title}
              </Text>
              <Text as="p" variant="bodyMd">
                Inventory : {product.totalInventory ?? 0}
              </Text>
            </BlockStack>
          </Card>
        ))}
      </BlockStack>
    </BlockStack>
  );
}