export type LoginInput = {
  email: string;
  password: string;
};

export interface RegisterMerchantInput {
  restaurantName: string;
  ownerName: string;
  email: string;
  password?: string;
  phone: string;
  cccd: string;
  image: string;
  address: string;
}
