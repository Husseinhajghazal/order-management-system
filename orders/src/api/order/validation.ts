import { body, param } from "express-validator";
import { validator } from "@husseintickets/common";

const restaurantsOrderValidation = [
  param("id").trim().notEmpty().withMessage("sipariş id link'te verilmelidir."),
  validator,
];

const createValidation = [
  body("table_no").notEmpty().withMessage("Masa no gereklidir."),
  body("meals")
    .isArray({ min: 1 })
    .withMessage("Sipariş en az bir yemek içermelidir."),
  body("meals.*.id").isString().withMessage("Yemek id gereklidir."),
  body("meals.*.count")
    .isInt({ min: 1 })
    .withMessage("Yemek count gereklidir."),
  validator,
];

const addValidation = [
  param("id").trim().notEmpty().withMessage("sipariş id link'te verilmelidir."),
  body("meal_id").trim().notEmpty().withMessage("Meal id gereklidir."),
  body("count").isInt({ min: 1 }).withMessage("Yemek count gereklidir."),
  validator,
];

const removeValidation = [
  param("id").trim().notEmpty().withMessage("sipariş id link'te verilmelidir."),
  body("meal_id").trim().notEmpty().withMessage("Meal id gereklidir."),
  body("count").isInt({ min: 1 }).withMessage("Yemek count gereklidir."),
  validator,
];

const completeValidation = [
  param("id").trim().notEmpty().withMessage("sipariş id link'te verilmelidir."),
  validator,
];

const cancelValidation = [
  param("id").trim().notEmpty().withMessage("sipariş id link'te verilmelidir."),
  validator,
];

export {
  restaurantsOrderValidation,
  createValidation,
  addValidation,
  removeValidation,
  cancelValidation,
  completeValidation,
};
