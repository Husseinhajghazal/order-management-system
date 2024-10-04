import { Message } from "node-nats-streaming";
import { Subjects, Listener, GarsonCreatedEvent } from "@husseintickets/common";
import { queueGroupName } from "./queue-group-name";
import { createGarson } from "../../api/garson/service";

export class GarsonCreatedListener extends Listener<GarsonCreatedEvent> {
  readonly subject = Subjects.GarsonCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: GarsonCreatedEvent["data"], msg: Message) {
    await createGarson(
      data.id,
      data.image_url,
      data.name,
      data.email,
      data.restaurant_id
    );
    msg.ack();
  }
}
