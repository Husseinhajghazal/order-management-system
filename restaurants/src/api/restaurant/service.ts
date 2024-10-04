import jwt from "jsonwebtoken";

import { Restaurant } from "./restaurant";
import cloudinary from "../../config/cloudinary";
import { ApiError, Role } from "@husseintickets/common";

const checkNoRestaurant = async (key: string, value: string) => {
  let restaurant = undefined;
  try {
    restaurant = await Restaurant.findOne({ [key]: value });
  } catch (error) {
    throw new ApiError("Restoran bulmaya çalışırken hata oluştu.", 500);
  }
  if (restaurant) {
    throw new ApiError(
      "Bu verileri kullanan bir restoran var, başkası deneyin.",
      409
    );
  }
};

const create = async (
  image_url: string,
  name: string,
  email: string,
  password: string
) => {
  try {
    const restaurant = Restaurant.build({ image_url, name, email, password });
    return await restaurant.save();
  } catch (error) {
    throw new ApiError("Restoran oluşturuken hata oluştu.", 500);
  }
};

const signToken = (id: string) => {
  try {
    const expiresIn = Date.now() + 30 * 24 * 60 * 60 * 1000;
    const role = Role.Admin;
    const token = jwt.sign({ id, role }, process.env.JWT_SECRET!, {
      expiresIn: "30d",
    });
    return { token, expiresIn, role };
  } catch (error) {
    throw new ApiError("Token'i oluşturuken hata oluştu.", 500);
  }
};

const find = async (key: string, value: string) => {
  let restaurant = undefined;
  try {
    restaurant = await Restaurant.findOne({ [key]: value });
  } catch (error) {
    throw new ApiError("restoranınızı bulamaya çalışırken, hata oluştu.", 500);
  }
  if (!restaurant) {
    throw new ApiError(
      "Bilgilerinizi yanlış girmişsiniz, doğru bir şekilde tekrar yazar mısınız.",
      404
    );
  }
  return restaurant;
};

const findById = async (id: string) => {
  let restaurant = undefined;
  try {
    restaurant = await Restaurant.findById({ _id: id });
  } catch (error) {
    throw new ApiError(
      "Şifreyi oluştururken bir sorun oluştu, lütfen tekrar deneyiniz.",
      500
    );
  }
  if (!restaurant) {
    throw new ApiError("Restoranınızı bulamadık, lütfen tekrar deneyin.", 404);
  }
  return restaurant;
};

const deleteRes = async (id: string) => {
  try {
    await Restaurant.deleteOne({ _id: id });
  } catch (error) {
    throw new ApiError(
      "Restoranınızı silerken hata oluştu, lütfen tekrar deneyiniz.",
      500
    );
  }
};

const deleteImage = (image_url: string) => {
  setImmediate(async () => {
    try {
      const regex = /\/([^\/]+)\.(jpg|jpeg|png)$/i;
      const match = image_url.match(regex);
      const extractedPart = match![1];
      await cloudinary.uploader.destroy(extractedPart);
    } catch (e) {
      console.log(e);
    }
  });
};

const checkNoRestaurantV2 = async (key: string, value: string, id: string) => {
  let restaurant = undefined;
  try {
    restaurant = await Restaurant.findOne({
      [key]: value,
      _id: { $ne: id },
    });
  } catch (error) {
    throw new ApiError("Restoran bulmaya çalışırken hata oluştu.", 500);
  }
  if (restaurant) {
    throw new ApiError(
      "Bu verileri kullanan bir restoran var, başkası deneyin.",
      409
    );
  }
};

export {
  checkNoRestaurant,
  create,
  signToken,
  find,
  findById,
  deleteRes,
  deleteImage,
  checkNoRestaurantV2,
};
