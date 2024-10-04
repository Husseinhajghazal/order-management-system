import {
  ApiError,
  CustomError,
  NotAuthorizedError,
  OrderStatus,
  Role,
} from "@husseintickets/common";
import { Order, OrderAttrs } from "./order";
import { getGarsonById } from "../garson/service";

const getOrders = async (restaurant_id: string, status?: OrderStatus) => {
  try {
    return await Order.find({ restaurant_id, ...(status && { status }) });
  } catch (e) {
    throw new ApiError("Siparişleri çekerken hata oluştu.", 500);
  }
};

const getOrder = async (id: string) => {
  let order = undefined;
  try {
    order = await Order.findById({ _id: id }).populate(["garson", "meals"]);
  } catch (e) {
    throw new ApiError("Siparişi çekerken hata oluştu.", 500);
  }
  if (!order) {
    throw new ApiError("Siparişi bulunmadı, daha sonra tekrar deneyin.", 404);
  }
  return order;
};

const isBelongTo = (restaurant_id: string, order_restaurant_id: string) => {
  if (restaurant_id !== order_restaurant_id) {
    throw new ApiError("Bu sipariş restoranınıza ait değil.", 409);
  }
};

const getRestaurantId = async (role: Role, id: string) => {
  if (role === "garson") {
    const garson = await getGarsonById(id);
    return garson.restaurant_id;
  }
  if (role === "admin") {
    return id;
  }
  throw new NotAuthorizedError();
};

const create = async (attrs: OrderAttrs) => {
  try {
    const order = Order.build(attrs);
    order.save();
    return order;
  } catch (e) {
    if (e instanceof CustomError) {
      throw new ApiError(e.message, e.statusCode);
    }
    throw new ApiError("Siparişi kayıdederken hata oluştu.", 500);
  }
};

const NotCompletedOrCancelled = async (id: string) => {
  try {
    const order = await getOrder(id);
    if (order.status === OrderStatus.Complete) {
      throw new ApiError(
        "Sipariş tamamlanmıştır, artık işlem yapamazsınız.",
        400
      );
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new ApiError(
        "Sipariş iptal edilmiştir, artık işlem yapamazsınız.",
        400
      );
    }
    return order;
  } catch (e) {
    if (e instanceof CustomError) {
      throw new ApiError(e.message, e.statusCode);
    }
    throw new ApiError(
      "Sipariş tamamlanmış olup olmadığını emin olamıyoruz.",
      500
    );
  }
};

const isTableEmpty = async (table_no: number, restaurant_id: string) => {
  const order = await Order.findOne({
    table_no,
    restaurant_id,
    status: OrderStatus.Created,
  });
  if (order) {
    throw new ApiError(
      "Aynı masada birden fazla siparişler oluşturamazsınız.",
      404
    );
  }
};

export {
  getOrders,
  getOrder,
  isBelongTo,
  getRestaurantId,
  create,
  NotCompletedOrCancelled,
  isTableEmpty,
};
