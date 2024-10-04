import { ApiError } from "@husseintickets/common";
import { Meal } from "./meal";
import cloudinary from "../../config/cloudinary";

const getMeals = async (restaurant_id: string) => {
  try {
    return await Meal.find({ restaurant_id });
  } catch (e) {
    throw new ApiError("Yemekleri çekerken hata oluştu.", 500);
  }
};

const getMealById = async (id: string) => {
  let meal = undefined;
  try {
    meal = await Meal.findById({ _id: id });
  } catch (e) {
    throw new ApiError("Yemeği çekerken hata oluştu.", 500);
  }
  if (!meal) {
    throw new ApiError("Yemeği bulunmadı, daha sonra tekrar deneyin.", 404);
  }
  return meal;
};

const isBelongTo = (restaurant_id: string, meal_restaurant_id: string) => {
  if (restaurant_id !== meal_restaurant_id) {
    throw new ApiError("Bu yemek restoranınıza ait değil.", 409);
  }
};

const create = async (
  image_url: string,
  name: string,
  description: string,
  restaurant_id: string,
  price: number
) => {
  try {
    const meal = Meal.build({
      image_url,
      name,
      description,
      restaurant_id,
      price,
    });
    return await meal.save();
  } catch (error) {
    throw new ApiError("Yemeği oluşturuken hata oluştu.", 500);
  }
};

const deleteMeal = async (id: string) => {
  try {
    await Meal.deleteOne({ _id: id });
  } catch (error) {
    throw new ApiError(
      "yemeği silerken hata oluştu, lütfen tekrar deneyiniz.",
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

export { getMeals, getMealById, isBelongTo, create, deleteMeal, deleteImage };
