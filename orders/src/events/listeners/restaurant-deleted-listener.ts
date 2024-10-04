import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  RestaurantDeletedEvent,
} from "@husseintickets/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../api/order/order";
import { Meal } from "../../api/meals/meal";
import { Garson } from "../../api/garson/garson";

export class RestaurantDeletedListener extends Listener<RestaurantDeletedEvent> {
  readonly subject = Subjects.RestaurantDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: RestaurantDeletedEvent["data"], msg: Message) {
    await Order.deleteMany({ restaurant_id: data.id });
    await Meal.deleteMany({ restaurant_id: data.id });
    await Garson.deleteMany({ restaurant_id: data.id });
    msg.ack();
  }
}
