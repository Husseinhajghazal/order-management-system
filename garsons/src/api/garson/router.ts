import {
  Authenticate,
  AuthRestaurant,
  fileUpload,
} from "@husseintickets/common";
import express from "express";
import {
  changeImageValidation,
  changeInfoValidation,
  changePasswordValidation,
  createValidation,
  deleteValidation,
  loginValidation,
  restaurantsGarsonValidation,
} from "./validation";
import {
  changeImageController,
  changeInformationController,
  changePasswordController,
  createController,
  deleteController,
  loginController,
  restaurantsGarsonController,
  restaurantsGarsonsController,
} from "./controller";

const router = express.Router();

router.get("/", Authenticate, AuthRestaurant, restaurantsGarsonsController);

router.get(
  "/:id",
  Authenticate,
  AuthRestaurant,
  restaurantsGarsonValidation,
  restaurantsGarsonController
);

router.post(
  "/",
  Authenticate,
  AuthRestaurant,
  fileUpload.single("image"),
  createValidation,
  createController
);

router.post("/login", loginValidation, loginController);

router.put(
  "/:id",
  Authenticate,
  AuthRestaurant,
  changeInfoValidation,
  changeInformationController
);

router.put(
  "/:id/password",
  Authenticate,
  AuthRestaurant,
  changePasswordValidation,
  changePasswordController
);

router.put(
  "/:id/image",
  Authenticate,
  AuthRestaurant,
  fileUpload.single("image"),
  changeImageValidation,
  changeImageController
);

router.delete(
  "/:id",
  Authenticate,
  AuthRestaurant,
  deleteValidation,
  deleteController
);

export { router as garsonRouter };
