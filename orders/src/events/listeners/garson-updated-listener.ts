import { Message } from "node-nats-streaming";
import { Subjects, Listener, GarsonUpdatedEvent } from "@husseintickets/common";
import { queueGroupName } from "./queue-group-name";
import { getGarsonById } from "../../api/garson/service";

export class GarsonUpdatedListener extends Listener<GarsonUpdatedEvent> {
  readonly subject = Subjects.GarsonUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: GarsonUpdatedEvent["data"], msg: Message) {
    const garson = await getGarsonById(data.id);
    garson.set({
      image_url: data.image_url,
      name: data.name,
      email: data.email,
      restaurant_id: data.restaurant_id,
    });
    await garson.save();
    msg.ack();
  }
}
