import mongoose from "mongoose";
import { GarsonDoc } from "../garson/garson";
import { OrderMeal, OrderMealDoc } from "../order-meal/order-meal";
import { OrderStatus } from "@husseintickets/common";

export interface OrderAttrs {
  table_no: number;
  total_price: number;
  restaurant_id: string;
  garson: GarsonDoc;
  meals: OrderMealDoc[];
}

interface OrderDoc extends mongoose.Document {
  table_no: number;
  total_price: number;
  restaurant_id: string;
  status: OrderStatus;
  garson: GarsonDoc;
  meals: OrderMealDoc[];
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    table_no: {
      type: Number,
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
    },
    restaurant_id: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    garson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Garson",
    },
    meals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderMeal",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.pre("deleteMany", async function (next) {
  const condition = this.getFilter();
  const orders = await Order.find(condition);
  for (let i = 0; i < orders.length; i++) {
    await OrderMeal.deleteMany({ order_id: orders[i].id });
  }
  next();
});

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
