import mongoose from "mongoose";
import { hashPassword } from "@husseintickets/common";
import { deleteImage } from "./service";

interface GarsonAttrs {
  image_url: string;
  name: string;
  email: string;
  password: string;
  restaurant_id: string;
}

interface GarsonModel extends mongoose.Model<GarsonDoc> {
  build(attrs: GarsonAttrs): GarsonDoc;
}

interface GarsonDoc extends mongoose.Document {
  image_url: string;
  name: string;
  email: string;
  password: string;
  restaurant_id: string;
  hasOrders: Boolean;
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
    password: {
      type: String,
      required: true,
    },
    restaurant_id: {
      type: String,
      required: true,
    },
    hasOrders: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.hasOrders;
      },
    },
  }
);

GarsonSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashedPassword = await hashPassword(this.get("password"));
    this.set("password", hashedPassword);
  }
  done();
});

GarsonSchema.pre("deleteMany", async function (next) {
  const conditions = this.getFilter();
  const garsons = await this.model.find(conditions);
  garsons.forEach((garson) => {
    deleteImage(garson.image_url);
  });
  next();
});

GarsonSchema.statics.build = (attrs: GarsonAttrs) => {
  return new Garson(attrs);
};

const Garson = mongoose.model<GarsonDoc, GarsonModel>("Garson", GarsonSchema);

export { Garson };
