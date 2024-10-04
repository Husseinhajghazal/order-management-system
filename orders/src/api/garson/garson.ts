import mongoose from "mongoose";

export interface GarsonAttrs {
  id: string;
  image_url: string;
  name: string;
  email: string;
  restaurant_id: string;
}

interface GarsonModel extends mongoose.Model<GarsonDoc> {
  build(attrs: GarsonAttrs): GarsonDoc;
}

export interface GarsonDoc extends mongoose.Document {
  image_url: string;
  name: string;
  email: string;
  restaurant_id: string;
}

const GarsonSchema = new mongoose.Schema(
  {
    image_url: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    restaurant_id: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.restaurant_id;
      },
    },
  }
);

GarsonSchema.statics.build = (attrs: GarsonAttrs) => {
  return new Garson({
    _id: attrs.id,
    image_url: attrs.image_url,
    name: attrs.name,
    email: attrs.email,
    restaurant_id: attrs.restaurant_id,
  });
};

const Garson = mongoose.model<GarsonDoc, GarsonModel>("Garson", GarsonSchema);

export { Garson };
