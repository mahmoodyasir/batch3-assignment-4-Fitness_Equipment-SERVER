import { Types } from "mongoose";

interface IuserInfo{
    name: string;
    email: string;
    phone: string;
    delivery_address: string;

}

interface IProduct{
    product: Types.ObjectId;
    quantity: number;
    total_price: number;
}

export type TOrder = {
    user: IuserInfo;
    items: IProduct[];
}