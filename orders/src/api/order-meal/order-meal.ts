import mongoose from "mongoose";

export interface OrderMealAttrs {
  image_url: string;
  name: string;
  description: string;
  price: number;
  count: number;
  meal_id: string;
  order_id: string;
}

interface OrderMealModel extends mongoose.Model<OrderMealDoc> {
  build(attrs: OrderMealAttrs): OrderMealDoc;
}

export interface OrderMealDoc extends mongoose.Document {
  image_url: string;
  name: string;
  description: string;
  price: number;
  count: number;
  meal_id: string;
  order_id: string;
}

const OrderMealSchema = new mongoose.Schema(
  {
    image_url: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    meal_id: { type: String, required: true },
    order_id: { type: String, required: true },
    price: { type: Number, required: true },
    count: { type: Number, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

OrderMealSchema.statics.build = (attrs: OrderMealAttrs) => {
  return new OrderMeal({
    image_url: attrs.image_url,
    name: attrs.name,
    description: attrs.description,
    price: attrs.price,
    meal_id: attrs.meal_id,
    order_id: attrs.order_id,
    count: attrs.count,
  });
};

const OrderMeal = mongoose.model<OrderMealDoc, OrderMealModel>(
  "OrderMeal",
  OrderMealSchema
);

export { OrderMeal };
