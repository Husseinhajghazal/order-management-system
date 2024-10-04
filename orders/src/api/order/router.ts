import {
  Authenticate,
  AuthGarson,
  AuthRestaurant,
} from "@husseintickets/common";
import express from "express";
import {
  addContoller,
  cancelController,
  completeContoller,
  createController,
  removeContoller,
  restaurantsOrderController,
  restaurantsOrdersController,
} from "./controller";
import {
  addValidation,
  cancelValidation,
  completeValidation,
  createValidation,
  removeValidation,
  restaurantsOrderValidation,
} from "./validation";

const router = express.Router();

router.get("/", Authenticate, restaurantsOrdersController);

router.get(
  "/:id",
  Authenticate,
  restaurantsOrderValidation,
  restaurantsOrderController
);

router.post("/", Authenticate, AuthGarson, createValidation, createController);

router.delete("/:id", Authenticate, cancelValidation, cancelController);

router.put(
  "/:id",
  Authenticate,
  AuthRestaurant,
  completeValidation,
  completeContoller
);

router.put("/:id/add", Authenticate, addValidation, addContoller);

router.put("/:id/remove", Authenticate, removeValidation, removeContoller);

export { router as orderRouter };
