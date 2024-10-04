import { Request, Response } from "express";
import {
  checkNoGarson,
  checkNoGarsonV2,
  create,
  deleteGarson,
  deleteImage,
  find,
  getGarsonById,
  getGarsons,
  isBelongTo,
  signToken,
} from "./service";
import { checkPassword, successRes } from "@husseintickets/common";
import cloudinary from "../../config/cloudinary";
import { GarsonCreatedPublisher } from "../../events/publishers/garson-created-publisher";
import { natsWrapper } from "../../nats-wrapper";
import { GarsonDeletedPublisher } from "../../events/publishers/garson-deleted-publisher";
import { GarsonUpdatedPublisher } from "../../events/publishers/garson-updated-publisher";

const restaurantsGarsonsController = async (req: Request, res: Response) => {
  const garsons = await getGarsons(req.payload!.id);
  successRes(res, "Garsonları başarı ile çektik.", garsons);
};

const restaurantsGarsonController = async (req: Request, res: Response) => {
  const garson = await getGarsonById(req.params.id);
  isBelongTo(req.payload!.id, garson!.restaurant_id);
  successRes(res, "Garsonu başarı ile çektik.", [garson.toJSON()]);
};

const createController = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  await checkNoGarson("email", email);
  const cloudImage = await cloudinary.uploader.upload(req.file!.path);
  const garson = await create(
    cloudImage.url,
    name,
    email,
    password,
    req.payload!.id
  );
  new GarsonCreatedPublisher(natsWrapper.client).publish({
    id: garson.id,
    image_url: garson.image_url,
    name: garson.name,
    email: garson.email,
    restaurant_id: garson.restaurant_id,
  });
  successRes(res, "Garson hesapı başarı ile oluşturuldu.", [garson.toJSON()]);
};

const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const garson = await find("email", email);
  await checkPassword(password, garson.password);
  const { token, expiresIn, role } = signToken(garson.id);
  successRes(res, "başarı ile giriş yaptınız.", [
    { ...garson.toJSON(), token, expiresIn, role },
  ]);
};

const changeInformationController = async (req: Request, res: Response) => {
  const garson = await getGarsonById(req.params.id);
  const { password, email, name } = req.body;
  await checkNoGarsonV2("email", email, garson.id);
  await checkPassword(password, garson.password);
  garson.set({ email, name });
  await garson.save();
  new GarsonUpdatedPublisher(natsWrapper.client).publish({
    id: garson.id,
    image_url: garson.image_url,
    name: garson.name,
    email: garson.email,
    restaurant_id: garson.restaurant_id,
  });
  successRes(res, "Garsonun bilgileri güncellendi", [garson.toJSON()]);
};

const changePasswordController = async (req: Request, res: Response) => {
  const garson = await getGarsonById(req.params.id);
  const { old_password, new_password } = req.body;
  await checkPassword(old_password, garson.password);
  garson.set({ password: new_password });
  await garson.save();
  new GarsonUpdatedPublisher(natsWrapper.client).publish({
    id: garson.id,
    image_url: garson.image_url,
    name: garson.name,
    email: garson.email,
    restaurant_id: garson.restaurant_id,
  });
  successRes(res, "Şifrenizi güncelendi.", [garson.toJSON()]);
};

const changeImageController = async (req: Request, res: Response) => {
  const garson = await getGarsonById(req.params.id);
  await checkPassword(req.body.password, garson.password);
  const cloudImage = await cloudinary.uploader.upload(req.file!.path);
  deleteImage(garson.image_url);
  garson.set({ image_url: cloudImage.url });
  await garson.save();
  new GarsonUpdatedPublisher(natsWrapper.client).publish({
    id: garson.id,
    image_url: garson.image_url,
    name: garson.name,
    email: garson.email,
    restaurant_id: garson.restaurant_id,
  });
  successRes(res, "Fotoğrafı güncelendi.", [garson.toJSON()]);
};

const deleteController = async (req: Request, res: Response) => {
  const garson = await getGarsonById(req.params.id);
  isBelongTo(req.payload!.id, garson.restaurant_id);
  await deleteGarson(req.params.id);
  if (!garson.hasOrders) {
    deleteImage(garson.image_url);
    new GarsonDeletedPublisher(natsWrapper.client).publish({ id: garson.id });
  }
  successRes(res, "Garsonu başarı ile silindi.", [garson.toJSON()]);
};

export {
  restaurantsGarsonsController,
  createController,
  loginController,
  changeInformationController,
  changePasswordController,
  changeImageController,
  deleteController,
  restaurantsGarsonController,
};
