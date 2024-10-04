import { ApiError } from "@husseintickets/common";
import { Garson } from "./garson";

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

const createGarson = async (
  id: string,
  image_url: string,
  name: string,
  email: string,
  restaurant_id: string
) => {
  try {
    const garson = Garson.build({
      id,
      image_url,
      name,
      email,
      restaurant_id,
    });
    return await garson.save();
  } catch (error) {
    throw new ApiError("Garsonu oluşturuken hata oluştu.", 500);
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

export { getGarsonById, createGarson, deleteGarson };
