# Inventory Sorter Shopify App

## Overview

This Shopify app allows a user to select a custom collection and sort its products based on inventory levels.

The app currently supports:

* Inventory high to low
* Inventory low to high
* Out of stock first

It also displays product images, titles, and inventory counts.

---

## Features

* Fetch custom collections from Shopify
* Select a collection from a dropdown
* Fetch products from the selected collection
* Sort products based on inventory
* Display product image, title, and inventory
* Handle products with missing images safely

---

## Tech Stack

* Shopify App (Node + React Router template)
* React
* React Router
* Shopify Admin GraphQL API
* Shopify Polaris
* TypeScript

---

## Project Structure

```bash
app/
├── components/
│   ├── CollectionSelector.tsx
│   └── ProductsList.tsx
├── routes/
│   └── app.inventory-sorter.tsx
├── services/
│   └── collection.server.ts
├── types/
│   └── inventory.ts
├── utils/
│   └── sortProducts.ts
└── shopify.server.ts
```

---

## How It Works

### 1. Loader

The `loader` fetches custom collections from Shopify using the Admin GraphQL API.

```ts
export async function loader({ request }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);
  const collections = await getCollections(admin);
  return { collections };
}
```

This data is then accessed in the route component using `useLoaderData()`.

---

### 2. Action

The `action` handles form submission when a user selects a collection.

```ts
export async function action({ request }: ActionFunctionArgs) {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const collectionId = String(formData.get("collectionId") || "");
  const collectionProducts = await GetCollectionProducts(admin, collectionId);
  return { collectionProducts };
}
```

This fetches products for the selected collection and returns them to the frontend.

---

### 3. Frontend Data Flow

* Collections are loaded using `useLoaderData()`
* Products are returned from `action()` using `useActionData()`
* Products are sorted on the frontend using the selected sort mode
* Sorted products are rendered in `ProductsList`

---

## Sorting Options

Sorting is handled in `app/utils/sortProducts.ts`.

Supported sort modes:

* `inventory_desc` → Inventory high to low
* `inventory_asc` → Inventory low to high
* `out_of_stock` → Out of stock first

Example:

```ts
export type SortMode = "inventory_desc" | "inventory_asc" | "out_of_stock";
```

---

## GraphQL Queries

### Fetch Collections

The app fetches only custom collections:

```graphql
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
```

### Fetch Collection Products

The app fetches products of the selected collection, including image and inventory data:

```graphql
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
          featuredImage {
            url
            altText
          }
        }
      }
    }
  }
}
```

---

## TypeScript Types

### Product Type

```ts
export type ProductNode = {
  id: string;
  title: string;
  totalInventory: number | null;
  featuredImage?: {
    url: string;
    altText: string | null;
  } | null;
};
```

### Collection Type

```ts
export type CollectionNode = {
  id: string;
  title: string;
  sortOrder: string;
};
```

---

## UI Components

### CollectionSelector

Responsible for:

* displaying the collection dropdown
* handling collection selection
* submitting the selected collection

### ProductsList

Responsible for:

* rendering product cards
* showing product image
* showing title
* showing inventory

---

## Edge Cases Handled

* Products with no image
* Products with `null` inventory
* Safe fallback for missing `altText`
* Avoiding mutation by copying array before sorting

Example:

```ts
const invA = a.totalInventory ?? 0;
const invB = b.totalInventory ?? 0;
```

---

## Current Functionality

The app currently supports:

* Loading custom collections
* Selecting a collection
* Fetching products for that collection
* Sorting products by inventory
* Showing product images and inventory in the UI

---

## Possible Improvements

* Move sorting logic to the backend
* Add more sorting options
* Add stock status badges
* Improve loading and error states
* Persist sorted order back to Shopify if required
* Add pagination for larger collections

---

## Notes

At the moment, the app sorts products only in the frontend UI.
It does not yet update the actual product order inside Shopify.

---

## Author

Built as part of a Shopify app internship project.
