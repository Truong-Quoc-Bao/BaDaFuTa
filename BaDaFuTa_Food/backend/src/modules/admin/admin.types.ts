export interface AdminLoginInput {
    email?: string;
    password?: string;
  }
  
  export interface CreatePartnerInput {
    restaurantName: string;
    ownerName: string;
    email: string;
    password?: string;
    phone: string;
    address: string;
  }