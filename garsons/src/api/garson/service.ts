import { ApiError, Role } from "@husseintickets/common";
import { Garson } from "./garson";
import jwt from "jsonwebtoken";
import cloudinary from "../../config/cloudinary";

const getGarsons = async (restaurant_id: string) => {
  try {
    return await Garson.find({ restaurant_id });
  } catch (e) {
    throw new ApiError("Garsonları çekerken hata oluştu.", 500);
  }
};

const getGarsonById = async (id: string) => {
  let garson = undefined;
  try {
    garson = await Garson.findById({ _id: id });
  } catch (e) {
    throw new ApiError("Garsonu çekerken hata oluştu.", 500);
  }
  if (!garson) {
    throw new ApiError("Garsonu bulunmadı, daha sonra tekrar deneyin.", 404);
  }
  return garson;
};

const isBelongTo = (restaurant_id: string, garson_restaurant_id: string) => {
  if (restaurant_id !== garson_restaurant_id) {
    throw new ApiError("Bu garson restoranınıza ait değil.", 409);
  }
};

const checkNoGarson = async (key: string, value: string) => {
  let garson = undefined;
  try {
    garson = await Garson.findOne({ [key]: value });
  } catch (e) {
    throw new ApiError("Bir sorun oluştu, daha sonra tekrar dener misin.", 500);
  }
  if (garson) {
    throw new ApiError(
      "Bu verileri kullanan bir garson var, başkası deneyin.",
      409
    );
  }
};

const create = async (
  image_url: string,
  name: string,
  email: string,
  password: string,
  restaurant_id: string
) => {
  try {
    const garson = Garson.build({
      image_url,
      name,
      email,
      password,
      restaurant_id,
    });
    return await garson.save();
  } catch (error) {
    throw new ApiError("Garsonu oluşturuken hata oluştu.", 500);
  }
};

const find = async (key: string, value: string) => {
  let garson = undefined;
  try {
    garson = await Garson.findOne({ [key]: value });
  } catch (error) {
    throw new ApiError("Hesapınızı bulamaya çalışırken, hata oluştu.", 500);
  }
  if (!garson) {
    throw new ApiError(
      "Bilgilerinizi yanlış girmişsiniz, doğru bir şekilde tekrar yazar mısınız.",
      404
    );
  }
  return garson;
};

const signToken = (id: string) => {
  try {
    const expiresIn = Date.now() + 30 * 24 * 60 * 60 * 1000;
    const role = Role.Garson;
    const token = jwt.sign({ id, role }, process.env.JWT_SECRET!, {
      expiresIn: "30d",
    });
    return { token, expiresIn, role };
  } catch (error) {
    throw new ApiError("Token'i oluşturuken hata oluştu.", 500);
  }
};

const deleteGarson = async (id: string) => {
  try {
    await Garson.deleteOne({ _id: id });
  } catch (error) {
    throw new ApiError(
      "Garsonu silerken hata oluştu, lütfen tekrar deneyiniz.",
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

const checkNoGarsonV2 = async (key: string, value: string, id: string) => {
  let garson = undefined;
  try {
    garson = await Garson.findOne({ [key]: value, _id: { $ne: id } });
  } catch (e) {
    throw new ApiError("Bir sorun oluştu, daha sonra tekrar dener misin.", 500);
  }
  if (garson) {
    throw new ApiError(
      "Bu verileri kullanan bir garson var, başkası deneyin.",
      409
    );
  }
};

export {
  getGarsonById,
  deleteGarson,
  getGarsons,
  isBelongTo,
  checkNoGarson,
  create,
  find,
  signToken,
  deleteImage,
  checkNoGarsonV2,
};
