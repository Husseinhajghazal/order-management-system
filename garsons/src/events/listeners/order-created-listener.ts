import { Message } from "node-nats-streaming";
import { Subjects, Listener, OrderCreatedEvent } from "@husseintickets/common";
import { queueGroupName } from "./queue-group-name";
import { getGarsonById } from "../../api/garson/service";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const garson = await getGarsonById(data.garson_id);
    await garson.updateOne({ hasOrders: true });
    msg.ack();
  }
}
