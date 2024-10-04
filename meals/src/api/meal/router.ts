import {
  Authenticate,
  AuthRestaurant,
  fileUpload,
} from "@husseintickets/common";
import express from "express";
import {
  createValidation,
  deleteValidation,
  editValidation,
  restaurantsMealsValidation,
  restaurantsMealValidation,
} from "./validation";
import {
  createController,
  deleteController,
  editController,
  restaurantsMealController,
  restaurantsMealsController,
} from "./controller";

const router = express.Router();

router.get(
  "/:restaurant_id",
  Authenticate,
  restaurantsMealsValidation,
  restaurantsMealsController
);

router.get(
  "/:restaurant_id/:id",
  Authenticate,
  restaurantsMealValidation,
  restaurantsMealController
);

router.post(
  "/",
  Authenticate,
  AuthRestaurant,
  fileUpload.single("image"),
  createValidation,
  createController
);

router.put(
  "/:id",
  Authenticate,
  AuthRestaurant,
  fileUpload.single("image"),
  editValidation,
  editController
);

router.delete("/:id", Authenticate, deleteValidation, deleteController);

export { router as mealRouter };
