export type CollectionNode = {
    id: string;
    title: string;
    sortOrder: string;
  };
  
  export type ProductNode = {
    id: string;
    title: string;
    totalInventory: number | null;
    featuredImage?:{
      url:string;
      altText:String | null;
    } | null
  };