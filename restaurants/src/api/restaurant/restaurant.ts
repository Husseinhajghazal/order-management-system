import { hashPassword } from "@husseintickets/common";
import mongoose from "mongoose";

interface RestaurantAttrs {
  image_url: string;
  name: string;
  email: string;
  password: string;
}

interface RestaurantModel extends mongoose.Model<RestaurantDoc> {
  build(attrs: RestaurantAttrs): RestaurantDoc;
}

interface RestaurantDoc extends mongoose.Document {
  image_url: string;
  name: string;
  email: string;
  password: string;
}

const RestaurantSchema = new mongoose.Schema(
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
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
    },
  }
);

RestaurantSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashedPassword = await hashPassword(this.get("password"));
    this.set("password", hashedPassword);
  }
  done();
});

RestaurantSchema.statics.build = (attrs: RestaurantAttrs) => {
  return new Restaurant(attrs);
};

const Restaurant = mongoose.model<RestaurantDoc, RestaurantModel>(
  "Restaurant",
  RestaurantSchema
);

export { Restaurant };
