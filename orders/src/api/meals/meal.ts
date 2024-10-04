import mongoose from "mongoose";

interface MealAttrs {
  id: string;
  image_url: string;
  name: string;
  description: string;
  price: number;
}

interface MealModel extends mongoose.Model<MealDoc> {
  build(attrs: MealAttrs): MealDoc;
}

interface MealDoc extends mongoose.Document {
  image_url: string;
  name: string;
  description: string;
  price: number;
}

const MealSchema = new mongoose.Schema(
  {
    image_url: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
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

MealSchema.statics.build = (attrs: MealAttrs) => {
  return new Meal({
    _id: attrs.id,
    image_url: attrs.image_url,
    name: attrs.name,
    description: attrs.description,
    price: attrs.price,
  });
};

const Meal = mongoose.model<MealDoc, MealModel>("Meal", MealSchema);

export { Meal };
