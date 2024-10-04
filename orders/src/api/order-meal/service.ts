import { ApiError, CustomError } from "@husseintickets/common";
import { getMealById } from "../meals/service";
import { OrderMeal, OrderMealAttrs } from "./order-meal";

const createOrderMeal = async (attrs: OrderMealAttrs) => {
  try {
    const orderMeal = OrderMeal.build(attrs);
    await orderMeal.save();
    return orderMeal;
  } catch (e) {
    throw new ApiError("Siparişi kayıdederken hata oluştu.", 500);
  }
};

const createManyOrderMeals = async (
  meals: { id: string; count: number }[],
  order_id: string
) => {
  try {
    let mealsData = [];
    let total_price = 0;
    for (let { id, count } of meals) {
      const meal = await getMealById(id);
      const mealData = await createOrderMeal({
        image_url: meal.image_url,
        name: meal.name,
        description: meal.description,
        price: meal.price,
        meal_id: meal.id,
        order_id,
        count,
      });
      mealsData.push(mealData);
      total_price += meal.price * count;
    }
    return { mealsData, total_price };
  } catch (e) {
    if (e instanceof CustomError) {
      throw new ApiError(e.message, e.statusCode);
    }
    throw new ApiError("Sipariş yemekleri kayıdederken hata oluştu.", 500);
  }
};

const getOrderMeal = async (id: string, order_id: string) => {
  try {
    const orderMeal = await OrderMeal.findOne({ meal_id: id, order_id });
    if (!orderMeal) {
      throw new ApiError("Yemeği siparişte bulunmadı", 404);
    }
    return orderMeal;
  } catch (e) {
    if (e instanceof CustomError) {
      throw new ApiError(e.message, e.statusCode);
    }
    throw new ApiError("Siparişte yemeği bulmaya çalışırken hata oluştu.", 500);
  }
};

const deleteMealOrder = async (id: string) => {
  try {
    await OrderMeal.deleteOne({ _id: id });
  } catch (error) {
    throw new ApiError(
      "Siparişten yemeği silerken hata oluştu, lütfen tekrar deneyiniz.",
      500
    );
  }
};

export { createManyOrderMeals, getOrderMeal, createOrderMeal, deleteMealOrder };
