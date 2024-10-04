import express from "express";
import {
  changeImageController,
  changeInformationController,
  changePasswordController,
  deleteResController,
  loginController,
  signUpController,
} from "./controller";
import {
  signValidation,
  loginValidation,
  changeInfoValidation,
  changePasswordValidation,
  changeImageValidation,
} from "./validation";
import {
  Authenticate,
  AuthRestaurant,
  fileUpload,
} from "@husseintickets/common";

const router = express.Router();

router.post("/", fileUpload.single("image"), signValidation, signUpController);

router.post("/login", loginValidation, loginController);

router.put(
  "/",
  Authenticate,
  AuthRestaurant,
  changeInfoValidation,
  changeInformationController
);

router.put(
  "/password",
  Authenticate,
  AuthRestaurant,
  changePasswordValidation,
  changePasswordController
);

router.put(
  "/image",
  Authenticate,
  AuthRestaurant,
  fileUpload.single("image"),
  changeImageValidation,
  changeImageController
);

router.delete("/", Authenticate, AuthRestaurant, deleteResController);

export { router as restaurantRouter };
