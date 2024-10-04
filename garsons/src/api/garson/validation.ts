import { validator } from "@husseintickets/common";
import { body, param } from "express-validator";

const createValidation = [
  body("name").trim().notEmpty().withMessage("İsim gerekli."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("E-posta gereklidir.")
    .isEmail()
    .withMessage("Lütfen geçerli bir e-posta adresi girin."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Şifre gereklidir.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$/)
    .withMessage(
      "Şifreniz en az 1 küçük harf, 1 büyük harf, 1 rakam içermeli ve 8 ile 16 karakter arasında olmalıdır."
    ),
  validator,
];

const changeInfoValidation = [
  param("id").trim().notEmpty().withMessage("Garson id link'te verilmelidir."),
  body("name").trim().notEmpty().withMessage("İsim gerekli."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("E-posta gereklidir.")
    .isEmail()
    .withMessage("Lütfen geçerli bir e-posta adresi girin."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Şifre gereklidir.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$/)
    .withMessage(
      "Şifreniz en az 1 küçük harf, 1 büyük harf, 1 rakam içermeli ve 8 ile 16 karakter arasında olmalıdır."
    ),
  validator,
];

const changePasswordValidation = [
  param("id").trim().notEmpty().withMessage("Garson id link'te verilmelidir."),
  body("old_password")
    .trim()
    .notEmpty()
    .withMessage("Eski şifre gerekli.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$/)
    .withMessage(
      "Eski şifreniz en az 1 küçük harf, 1 büyük harf, 1 rakam içermeli ve 8 ile 16 karakter arasında olmalıdır."
    ),
  body("new_password")
    .trim()
    .notEmpty()
    .withMessage("Yeni şifre gereklidir.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$/)
    .withMessage(
      "Yeni şifre en az 1 küçük harf, 1 büyük harf, 1 rakam içermeli ve 8 ile 16 karakter arasında olmalıdır."
    )
    .custom((value, { req }) => {
      if (value === req.body.old_password) {
        throw new Error("Eksi şifreniz ve yeni şifreniz aynı olmamalıdır.");
      }
      return true;
    }),
  body("confirm_password")
    .trim()
    .notEmpty()
    .withMessage("Şifre tekrarı gereklidir.")
    .custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error("Yeni şifrenin tekrarı eşleşmiyor.");
      }
      return true;
    }),
  validator,
];

const changeImageValidation = [
  param("id").trim().notEmpty().withMessage("Garson id link'te verilmelidir."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Şifre gereklidir.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$/)
    .withMessage(
      "Şifreniz en az 1 küçük harf, 1 büyük harf, 1 rakam içermeli ve 8 ile 16 karakter arasında olmalıdır."
    ),
  validator,
];

const deleteValidation = [
  param("id").trim().notEmpty().withMessage("Garson id link'te verilmelidir."),
  validator,
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("E-posta gereklidir.")
    .isEmail()
    .withMessage("Lütfen geçerli bir e-posta adresi girin."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Şifre gereklidir.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$/)
    .withMessage(
      "Şifreniz en az 1 küçük harf, 1 büyük harf, 1 rakam içermeli ve 8 ile 16 karakter arasında olmalıdır."
    ),
  validator,
];

const restaurantsGarsonValidation = [
  param("id").trim().notEmpty().withMessage("Garson id link'te verilmelidir."),
  validator,
];

export {
  createValidation,
  changeImageValidation,
  changeInfoValidation,
  changePasswordValidation,
  deleteValidation,
  loginValidation,
  restaurantsGarsonValidation,
};
