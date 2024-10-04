import { Message } from "node-nats-streaming";
import { Subjects, Listener, OrderCreatedEvent } from "@husseintickets/common";
import { queueGroupName } from "./queue-group-name";
import { getMealById } from "../../api/meal/service";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    for (let i = 0; i < data.meals.length; i++) {
      const meal = await getMealById(data.meals[i].id);
      await meal.updateOne({ is_reserve: true });
    }
    msg.ack();
  }
}
