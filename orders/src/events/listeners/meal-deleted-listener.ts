import { Message } from "node-nats-streaming";
import { Subjects, Listener, MealDeletedEvent } from "@husseintickets/common";
import { queueGroupName } from "./queue-group-name";
import { deleteMeal } from "../../api/meals/service";

export class MealDeletedListener extends Listener<MealDeletedEvent> {
  readonly subject = Subjects.MealDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: MealDeletedEvent["data"], msg: Message) {
    await deleteMeal(data.id);
    msg.ack();
  }
}
