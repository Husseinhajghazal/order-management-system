import { ApiError } from "@husseintickets/common";
import { Meal } from "./meal";

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

const createMeal = async (
  id: string,
  image_url: string,
  name: string,
  description: string,
  price: number
) => {
  try {
    const meal = Meal.build({
      id,
      image_url,
      name,
      description,
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

export { getMealById, createMeal, deleteMeal };
