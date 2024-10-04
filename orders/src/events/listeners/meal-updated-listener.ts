import { Message } from "node-nats-streaming";
import { Subjects, Listener, MealUpdatedEvent } from "@husseintickets/common";
import { queueGroupName } from "./queue-group-name";
import { getMealById } from "../../api/meals/service";

export class MealUpdatedListener extends Listener<MealUpdatedEvent> {
  readonly subject = Subjects.MealUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: MealUpdatedEvent["data"], msg: Message) {
    const meal = await getMealById(data.id);
    meal.set({
      image_url: data.image_url,
      name: data.name,
      description: data.description,
      price: data.price,
    });
    meal.save();
    msg.ack();
  }
}
