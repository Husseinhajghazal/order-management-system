import { validator } from "@husseintickets/common";
import { body } from "express-validator";

const signValidation = [
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

const changeInfoValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("E-posta gereklidir.")
    .isEmail()
    .withMessage("Lütfen geçerli bir e-posta adresi girin."),
  body("name").trim().notEmpty().withMessage("İsim gerekli."),
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
  body("old_password")
    .trim()
    .notEmpty()
    .withMessage("Eski şifre gerekli.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$/)
    .withMessage(
      "Şifreniz en az 1 küçük harf, 1 büyük harf, 1 rakam içermeli ve 8 ile 16 karakter arasında olmalıdır."
    ),
  body("new_password")
    .trim()
    .notEmpty()
    .withMessage("Yeni şifre gereklidir.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$/)
    .withMessage(
      "Şifreniz en az 1 küçük harf, 1 büyük harf, 1 rakam içermeli ve 8 ile 16 karakter arasında olmalıdır."
    )
    .custom((value, { req }) => {
      if (value === req.body.old_password) {
        throw new Error("eksi şifreniz ve yeni şifreniz aynı olmamalıdır.");
      }
      return true;
    }),
  body("confirm_password")
    .trim()
    .notEmpty()
    .withMessage("Şifrenin tekrarı gereklidir.")
    .custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error("Yeni şifrenin tekrarı eşleşmiyor.");
      }
      return true;
    }),
  validator,
];

const changeImageValidation = [
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

export {
  signValidation,
  loginValidation,
  changeInfoValidation,
  changePasswordValidation,
  changeImageValidation,
};
