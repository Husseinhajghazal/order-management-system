import {
  Publisher,
  GarsonUpdatedEvent,
  Subjects,
} from "@husseintickets/common";

export class GarsonUpdatedPublisher extends Publisher<GarsonUpdatedEvent> {
  readonly subject = Subjects.GarsonUpdated;
}
