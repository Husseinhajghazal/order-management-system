import { Request, Response } from "express";
import {
  checkNoRestaurant,
  checkNoRestaurantV2,
  create,
  deleteImage,
  deleteRes,
  find,
  findById,
  signToken,
} from "./service";
import cloudinary from "../../config/cloudinary";
import { checkPassword, successRes } from "@husseintickets/common";
import { RestaurantDeletedPublisher } from "../../events/publishers/restaurant-deleted-publisher";
import { natsWrapper } from "../../nats-wrapper";

const signUpController = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  await checkNoRestaurant("email", email);
  await checkNoRestaurant("name", name);
  const cloudImage = await cloudinary.uploader.upload(req.file!.path);
  const restaurant = await create(cloudImage.url, name, email, password);
  const { token, expiresIn, role } = signToken(restaurant.id);
  successRes(res, "Restoran başarı ile oluşturuldu.", [
    { ...restaurant.toJSON(), token, expiresIn, role },
  ]);
};

const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const restaurant = await find("email", email);
  await checkPassword(password, restaurant.password);
  const { token, expiresIn, role } = signToken(restaurant.id);
  successRes(res, "Başarı ile giriş yaptınız.", [
    { ...restaurant.toJSON(), token, expiresIn, role },
  ]);
};

const changeInformationController = async (req: Request, res: Response) => {
  const restaurant = await findById(req.payload!.id);
  const { email, name, password } = req.body;
  await checkNoRestaurantV2("email", email, restaurant.id);
  await checkNoRestaurantV2("name", name, restaurant.id);
  await checkPassword(password, restaurant.password);
  restaurant.set({ email, name });
  await restaurant.save();
  successRes(res, "Restoranın bilgileri başarı ile güncelendi.", [
    restaurant.toJSON(),
  ]);
};

const deleteResController = async (req: Request, res: Response) => {
  const restaurant = await findById(req.payload!.id);
  await deleteRes(restaurant.id);
  deleteImage(restaurant.image_url);
  new RestaurantDeletedPublisher(natsWrapper.client).publish({
    id: restaurant.id,
  });
  successRes(res, "Restoranınınzı silindi.", [restaurant.toJSON()]);
};

const changePasswordController = async (req: Request, res: Response) => {
  const restaurant = await findById(req.payload!.id);
  const { old_password, new_password } = req.body;
  await checkPassword(old_password, restaurant.password);
  restaurant.set({ password: new_password });
  await restaurant.save();
  successRes(res, "Şifrenizi güncelendi.", [restaurant.toJSON()]);
};

const changeImageController = async (req: Request, res: Response) => {
  const restaurant = await findById(req.payload!.id);
  await checkPassword(req.body.password, restaurant.password);
  const cloudImage = await cloudinary.uploader.upload(req.file!.path);
  deleteImage(restaurant.image_url);
  restaurant.set({ image_url: cloudImage.url });
  await restaurant.save();
  successRes(res, "Fotoğrafı güncelendi.", [restaurant.toJSON()]);
};

export {
  signUpController,
  loginController,
  changeInformationController,
  deleteResController,
  changePasswordController,
  changeImageController,
};
