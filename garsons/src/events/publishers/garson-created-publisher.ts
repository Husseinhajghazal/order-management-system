import {
  Publisher,
  GarsonCreatedEvent,
  Subjects,
} from "@husseintickets/common";

export class GarsonCreatedPublisher extends Publisher<GarsonCreatedEvent> {
  readonly subject = Subjects.GarsonCreated;
}
