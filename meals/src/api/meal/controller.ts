import { Request, Response } from "express";
import { successRes } from "@husseintickets/common";
import {
  create,
  deleteImage,
  deleteMeal,
  getMealById,
  getMeals,
  isBelongTo,
} from "./service";
import cloudinary from "../../config/cloudinary";
import { natsWrapper } from "../../nats-wrapper";
import { MealCreatedPublisher } from "../../events/publishers/meal-created-publisher";
import { MealUpdatedPublisher } from "../../events/publishers/meal-updated-publisher";
import { MealDeletedPublisher } from "../../events/publishers/meal-deleted-publisher";

const restaurantsMealsController = async (req: Request, res: Response) => {
  const meals = await getMeals(req.params.restaurant_id);
  successRes(res, "Yemekleri başarı ile çektik.", meals);
};

const restaurantsMealController = async (req: Request, res: Response) => {
  const meal = await getMealById(req.params.id);
  isBelongTo(req.params.restaurant_id, meal.restaurant_id);
  successRes(res, "Yemeği başarı ile çektik.", [meal.toJSON()]);
};

const createController = async (req: Request, res: Response) => {
  const { name, description, price } = req.body;
  const cloudImage = await cloudinary.uploader.upload(req.file!.path);
  const meal = await create(
    cloudImage.url,
    name,
    description,
    req.payload!.id,
    parseFloat(price)
  );
  new MealCreatedPublisher(natsWrapper.client).publish({
    id: meal.id,
    image_url: meal.image_url,
    name: meal.name,
    description: meal.description,
    price: meal.price,
  });
  successRes(res, "Yemeği başarı ile oluşturuldu.", [meal.toJSON()]);
};

const editController = async (req: Request, res: Response) => {
  const meal = await getMealById(req.params.id);
  isBelongTo(req.payload!.id, meal.restaurant_id);
  const { name, description, price } = req.body;
  let image_url;
  if (req.file?.path) {
    const cloudImage = await cloudinary.uploader.upload(req.file!.path);
    image_url = cloudImage.url;
    if (!meal.is_reserve) {
      deleteImage(meal.image_url);
    }
  } else {
    image_url = meal.image_url;
  }
  meal.set({ name, description, price: parseFloat(price), image_url });
  await meal.save();
  new MealUpdatedPublisher(natsWrapper.client).publish({
    id: meal.id,
    image_url: meal.image_url,
    name: meal.name,
    description: meal.description,
    price: meal.price,
  });
  successRes(res, "Yemeği başarı ile güncellendi.", [meal.toJSON()]);
};

const deleteController = async (req: Request, res: Response) => {
  const meal = await getMealById(req.params.id);
  isBelongTo(req.payload!.id, meal.restaurant_id);
  await deleteMeal(req.params.id);
  if (!meal.is_reserve) {
    deleteImage(meal.image_url);
  }
  new MealDeletedPublisher(natsWrapper.client).publish({ id: meal.id });
  successRes(res, "Yemeği başarı ile silindi.", [meal.toJSON()]);
};

export {
  restaurantsMealsController,
  restaurantsMealController,
  createController,
  deleteController,
  editController,
};
