import { BlockStack, Card, InlineStack, Text, Thumbnail } from "@shopify/polaris";
import { ProductNode } from "app/types/inventory";

type ProductsListProps = {
  collectionProducts: ProductNode[];
};

export default function ProductsList({ collectionProducts }: ProductsListProps) {
  console.log(collectionProducts)
  return (
    <BlockStack>
      <Text as="h3" variant="headingSm">
        Collection Products
      </Text>
      {/* Add gap between product cards */}
      <BlockStack gap="400">
        {collectionProducts.map((product) => (
          <Card key={product.id}>
            <InlineStack gap="400">
              {product.featuredImage?.url ? (
                <Thumbnail
                  size="medium"
                  source={product.featuredImage.url}
                  alt={typeof product.featuredImage.altText === "string" ? product.featuredImage.altText : product.title}
                />
              ) : (
                <Thumbnail
                  size="small"  
                  source=""
                  alt="No image"
                />
              )}
              <BlockStack>
                <Text as="h4" variant="headingSm">
                  {product.title}
                </Text>
                <Text as="p" variant="bodyMd">
                  Inventory : {product.totalInventory ?? 0}
                </Text>
              </BlockStack>
            </InlineStack>
          </Card>
        ))}
      </BlockStack>
    </BlockStack>
  );
}