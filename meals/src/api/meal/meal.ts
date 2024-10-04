import mongoose from "mongoose";
import { deleteImage } from "./service";

interface MealAttrs {
  image_url: string;
  name: string;
  description: string;
  restaurant_id: string;
  price: number;
}

interface MealModel extends mongoose.Model<MealDoc> {
  build(attrs: MealAttrs): MealDoc;
}

interface MealDoc extends mongoose.Document {
  image_url: string;
  name: string;
  description: string;
  restaurant_id: string;
  price: number;
  is_reserve: boolean;
}

const MealSchema = new mongoose.Schema(
  {
    image_url: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    restaurant_id: { type: String, required: true },
    price: { type: Number, required: true },
    is_reserve: { type: Boolean, required: true, default: false },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.is_reserve;
      },
    },
  }
);

MealSchema.pre("deleteMany", async function (next) {
  const conditions = this.getFilter();
  const meals = await this.model.find(conditions);
  meals.forEach((meal) => {
    deleteImage(meal.image_url);
  });
  next();
  next();
});

MealSchema.statics.build = (attrs: MealAttrs) => {
  return new Meal(attrs);
};

const Meal = mongoose.model<MealDoc, MealModel>("Meal", MealSchema);

export { Meal };
