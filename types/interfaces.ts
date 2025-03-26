export interface Product {
  productId: number;
  storeId: number;
  categoryId: number;
  name: string;
  stock: number;
  price: number;
  description: string;
  image: string;
  createdAt: string;
}

export interface Order {
  orderId: number;
  userId: number;
  storeId: number;
  orderDate: string;
  status: number;
  totalAmount: number;
  items: OrderItem[];
  paymentMethod: number;
  User_id: number;
}

export interface Cart {
  orderId: number;
  userId: number;
  storeId: number;
  orderDate: string;
  status: number;
  totalAmount: number;
  paymentMethod: number;
  User_id: number;
  items: OrderItem[];
  totalDiscountAmount: number;
}

export interface OrderDetail {
  orderId: number;
  userId: number;
  storeId: number;
  orderDate: string;
  status: number;
  totalAmount: number;
  paymentMethod: number;
  items: OrderItem[];
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface OrderItem {
  orderId: number;
  productId: number;
  quantity: number;
  Order_id: number;
  Product_id: number;
  Product: Product;
}

export interface User {
  userId: number;
  username: string;
  name: string;
  email: string;
  role: number;
  address: string;
  phone: string;
  createdAt?: string;
}

export interface Category {
  categoryId: number;
  name: string;
  description:string;
}