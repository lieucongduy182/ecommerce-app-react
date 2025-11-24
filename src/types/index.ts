export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: {
    address: string;
    city: string;
    postalCode: string;
  };
}

export interface Address {
  postalCode: string;
  street: string;
  detail: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  description: string;
  category: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ShippingInfo {
  fullName: string;
  phone: string;
  email: string;
  postalCode: string;
  address: string;
  detailedAddress: string;
  deliveryNotes: string;
}

type PaymentMethod = "credit_card" | "cash_on_delivery";

export interface PaymentInfo {
  paymentMethod: PaymentMethod;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

export interface Order {
  orderId: string;
  date: string;
  items: CartItem[];
  total: number;
  shipping: ShippingInfo;
  payment: PaymentInfo;
}
