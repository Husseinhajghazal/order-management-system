import { OrderStatus, successRes } from "@husseintickets/common";
import { Request, Response } from "express";
import {
  getOrders,
  getOrder,
  isBelongTo,
  getRestaurantId,
  create,
  NotCompletedOrCancelled,
  isTableEmpty,
} from "./service";
import {
  createManyOrderMeals,
  createOrderMeal,
  deleteMealOrder,
  getOrderMeal,
} from "../order-meal/service";
import { getGarsonById } from "../garson/service";
import { OrderMeal } from "../order-meal/order-meal";
import { getMealById } from "../meals/service";
import { OrderCreatedPublisher } from "../../events/publishers/order-created-publisher";
import { natsWrapper } from "../../nats-wrapper";

const restaurantsOrdersController = async (req: Request, res: Response) => {
  const { role, id } = req.payload!;
  const restaurant_id = await getRestaurantId(role, id);
  const orders = await getOrders(
    restaurant_id,
    req.query.status ? (req.query.status as OrderStatus) : undefined
  );
  successRes(res, "Siparişler başarı ile çekildi.", orders);
};

const restaurantsOrderController = async (req: Request, res: Response) => {
  const order = await getOrder(req.params.id);
  const { role, id } = req.payload!;
  const restaurant_id = await getRestaurantId(role, id);
  isBelongTo(order.restaurant_id, restaurant_id);
  successRes(res, "Siparişler başarı ile çekildi.", [order.toJSON()]);
};

const createController = async (req: Request, res: Response) => {
  const { table_no, meals } = req.body;
  const garson = await getGarsonById(req.payload!.id);
  await isTableEmpty(table_no, garson.restaurant_id);
  const order = await create({
    table_no,
    total_price: 0,
    restaurant_id: garson.restaurant_id,
    garson,
    meals: [],
  });
  const { mealsData, total_price } = await createManyOrderMeals(
    meals,
    order.id
  );
  order.set({ total_price, meals: mealsData });
  await order.save();
  new OrderCreatedPublisher(natsWrapper.client).publish({
    garson_id: garson.id,
    meals,
  });
  successRes(res, "", [order.toJSON()]);
};

const addContoller = async (req: Request, res: Response) => {
  const { meal_id, count } = req.body;
  const order_id = req.params.id;
  let order = await NotCompletedOrCancelled(order_id);
  let orderMeal = await OrderMeal.findOne({ meal_id, order_id });
  if (orderMeal) {
    const newCount = orderMeal.count + count;
    orderMeal.set({ count: newCount });
    const total_price = order.total_price + orderMeal.price * count;
    order.set({ total_price });
    await orderMeal.save();
  } else {
    const meal = await getMealById(meal_id);
    const newOrderMeal = await createOrderMeal({
      image_url: meal.image_url,
      name: meal.name,
      description: meal.description,
      price: meal.price,
      meal_id: meal.id,
      order_id: order.id,
      count,
    });
    const meals = [...order.meals, newOrderMeal];
    const total_price = order.total_price + newOrderMeal.price * count;
    order.set({
      meals,
      total_price,
    });
  }

  await order.save();
  order = await getOrder(req.params.id);
  successRes(res, "Sipariş Güncellendi.", [order.toJSON()]);
};

const removeContoller = async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const { meal_id, count } = req.body;
  let order = await NotCompletedOrCancelled(req.params.id);
  const orderMeal = await getOrderMeal(meal_id, orderId);
  if (orderMeal.count <= count) {
    const total_price = order.total_price - orderMeal.price * orderMeal.count;
    const meals = order.meals.filter((e) => e.id !== orderMeal.id);
    order.set({
      total_price,
      meals,
    });
    await deleteMealOrder(meal_id);
  } else {
    const newCount = orderMeal.count - count;
    const total_price = order.total_price - orderMeal.price * count;
    order.set({ total_price });
    orderMeal.set({ count: newCount, total_price });
    await orderMeal.save();
  }
  await order.save();
  order = await getOrder(orderId);
  successRes(res, `Sipariş Güncellendi.`, [order.toJSON()]);
};

const completeContoller = async (req: Request, res: Response) => {
  let order = await NotCompletedOrCancelled(req.params.id);
  isBelongTo(req.payload!.id, order.restaurant_id);
  order.set({ status: OrderStatus.Complete });
  await order.save();
  successRes(res, "Siparşi başarı ile tamamlandı.", [order.toJSON()]);
};

const cancelController = async (req: Request, res: Response) => {
  let order = await NotCompletedOrCancelled(req.params.id);
  const restaurant_id = await getRestaurantId(
    req.payload!.role,
    req.payload!.id
  );
  isBelongTo(restaurant_id, order.restaurant_id);
  order.set({ status: OrderStatus.Cancelled });
  await order.save();
  successRes(res, "Siparşi başarı ile iptal edildi.", [order.toJSON()]);
};

export {
  restaurantsOrdersController,
  restaurantsOrderController,
  createController,
  addContoller,
  removeContoller,
  cancelController,
  completeContoller,
};
