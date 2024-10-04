import { body, param } from "express-validator";
import { validator } from "@husseintickets/common";

const restaurantsMealsValidation = [
  param("restaurant_id")
    .trim()
    .notEmpty()
    .withMessage("Restoran id link'te verilmelidir."),
  validator,
];

const restaurantsMealValidation = [
  param("restaurant_id")
    .trim()
    .notEmpty()
    .withMessage("Restoran id link'te verilmelidir."),
  param("id").trim().notEmpty().withMessage("Yemek id link'te verilmelidir."),
  validator,
];

const createValidation = [
  body("name").trim().notEmpty().withMessage("İsim gerekli."),
  body("description").trim().notEmpty().withMessage("Açıklama gerekli."),
  body("price").notEmpty().withMessage("Fiyat gerekli."),
  validator,
];

const editValidation = [
  param("id").trim().notEmpty().withMessage("Yemek id link'te verilmelidir."),
  body("name").trim().notEmpty().withMessage("İsim gerekli."),
  body("description").trim().notEmpty().withMessage("Açıklama gerekli."),
  body("price").notEmpty().withMessage("Fiyat gerekli."),
  validator,
];

const deleteValidation = [
  param("id").trim().notEmpty().withMessage("Yemek id link'te verilmelidir."),
  validator,
];

export {
  restaurantsMealValidation,
  restaurantsMealsValidation,
  createValidation,
  editValidation,
  deleteValidation,
};
