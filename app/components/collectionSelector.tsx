import { BlockStack, Button, Select, Text } from "@shopify/polaris";
import {Form } from "react-router";


type collectionOption ={
    label: string;
    value : string
}


type CollectionSelectorProps = {
    collectionOptions: collectionOption[];
    selectedCollectionId : string;
    setSelectedCollectionId  : (value : string) => void;
}
export default function collectionSelecter (
   { collectionOptions , selectedCollectionId, setSelectedCollectionId} : CollectionSelectorProps
){
return(

    <BlockStack gap="400">
    <Text as="h2" variant="headingMd">
      Select a Collection
    </Text>

    <Form method="post">
      <BlockStack gap="400">
        <Select
          label="Collections"
          options={collectionOptions}
          value={selectedCollectionId}
          onChange={setSelectedCollectionId}
        />

        <input
          type="hidden"
          name="collectionId"
          value={selectedCollectionId}
        />

        <Button variant="primary" submit>
          Choose Collection
        </Button>
      </BlockStack>
    </Form>
  </BlockStack>
)


}