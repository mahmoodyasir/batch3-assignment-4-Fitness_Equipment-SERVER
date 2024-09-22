

export interface TProduct {
    name: string;
    price: number;
    description: string;
    images?: string[]; 
    stock_quantity: number;
    category: string;
    featured?: boolean;
  }
  