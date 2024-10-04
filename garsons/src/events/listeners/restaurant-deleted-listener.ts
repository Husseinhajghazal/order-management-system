import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  RestaurantDeletedEvent,
} from "@husseintickets/common";
import { queueGroupName } from "./queue-group-name";
import { Garson } from "../../api/garson/garson";

export class RestaurantDeletedListener extends Listener<RestaurantDeletedEvent> {
  readonly subject = Subjects.RestaurantDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: RestaurantDeletedEvent["data"], msg: Message) {
    await Garson.deleteMany({ restaurant_id: data.id });
    msg.ack();
  }
}
