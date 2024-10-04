import { Message } from "node-nats-streaming";
import { Subjects, Listener, GarsonDeletedEvent } from "@husseintickets/common";
import { queueGroupName } from "./queue-group-name";
import { deleteGarson } from "../../api/garson/service";

export class GarsonDeletedListener extends Listener<GarsonDeletedEvent> {
  readonly subject = Subjects.GarsonDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: GarsonDeletedEvent["data"], msg: Message) {
    await deleteGarson(data.id);
    msg.ack();
  }
}
