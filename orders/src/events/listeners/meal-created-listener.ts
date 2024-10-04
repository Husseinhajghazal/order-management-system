import { Message } from "node-nats-streaming";
import { Subjects, Listener, MealCreatedEvent } from "@husseintickets/common";
import { queueGroupName } from "./queue-group-name";
import { createMeal } from "../../api/meals/service";

export class MealCreatedListener extends Listener<MealCreatedEvent> {
  readonly subject = Subjects.MealCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: MealCreatedEvent["data"], msg: Message) {
    await createMeal(
      data.id,
      data.image_url,
      data.name,
      data.description,
      data.price
    );
    msg.ack();
  }
}
