export type Nullable<T> = T | null;

export enum SaleType {
  FIXED = "fixed",
  AUCTION = "auction",
}

export type Collection = {
  name: string;
  symbol: string;
  description: string;
  media: File;
  saleType: SaleType;
  price: number;
  editions?: number;
  endDate?: string;
};

export type TokenDataId = {
  creator: string;
  collection: string;
  name: string;
};

export type WithdrawCapability = {
  amount: string;
  expiration_sec: string;
  token_id: TokenId;
  token_owner: string;
};

export type TokenId = {
  property_version: string;
  token_data_id: TokenDataId;
};
