import { BlockStack, Button, InlineStack, Select, Text } from "@shopify/polaris";
import { Form, useSubmit } from "react-router";
import { type SortMode } from "app/utils/sortProducts";

type CollectionOption = {
  label: string;
  value: string;
};

type CollectionSelectorProps = {
  collectionOptions: CollectionOption[];
  selectedCollectionId: string;
  setSelectedCollectionId: (value: string) => void;
  sortMode: SortMode;
  sortOptions: CollectionOption[];
  setSortMode: (value: SortMode) => void;
  isLoading:boolean
};

const styles = {
  formRow: {
    display: "flex",
    alignItems: "flex-end",
    flexDirection: "row" as const,
    gap: "16px",
    flexWrap: "wrap" as const,
  },
  field: {
    flex: 1,
    minWidth: "200px",
  },
};

export default function CollectionSelector({
  collectionOptions,
  selectedCollectionId,
  setSelectedCollectionId,
  sortMode,
  sortOptions,
  setSortMode,
  isLoading
}: CollectionSelectorProps) {
  const submit = useSubmit();

  const submitIntent = (
    nextCollectionId: string,
    nextSortMode: SortMode,
    intent: "load_collection" | "sort_and_save"
  ) => {
    const formData = new FormData();
    formData.append("collectionId", nextCollectionId);
    formData.append("sortMode", nextSortMode);
    formData.append("intent", intent);
    submit(formData, { method: "post" });
  };



  return (
    <s-section>
      <s-heading>Select a Collection</s-heading>
      <Form method="post">
  <div style={styles.formRow}>

    <div style={styles.field}>
      <s-select
        label="Collections"
        value={selectedCollectionId}  
        onInput={(event) => {
          const value = (event.currentTarget as any).value;
          setSelectedCollectionId(value);
          if (value) submitIntent(value, sortMode, "load_collection");
        }}
      >
        {collectionOptions.map((option) => (
          <s-option value={option.value} key={option.value}>{option.label}</s-option>
        ))}
      </s-select>
    </div>

    <div style={styles.field}>
      <s-select
        label="Sort Products"
        value={sortMode}
        onInput={(event) => {
          const value = (event.currentTarget as any).value;
          const nextSortMode = value as SortMode;
          setSortMode(nextSortMode);
          submitIntent(selectedCollectionId, nextSortMode, "sort_and_save");
        }}
      >
        {sortOptions.map((option) => (
          <s-option value={option.value} key={option.value}>{option.label}</s-option>
        ))}
      </s-select>
    </div>

    <input type="hidden" name="collectionId" value={selectedCollectionId} />
    <input type="hidden" name="sortMode" value={sortMode} />
    <input type="hidden" name="intent" value="sort_and_save" />

    <s-button variant="primary" type="submit" disabled={!selectedCollectionId}>
      Sort and save to Shopify
    </s-button>

  </div>
</Form>
    </s-section>
  );
}
