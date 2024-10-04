import {
  Publisher,
  GarsonDeletedEvent,
  Subjects,
} from "@husseintickets/common";

export class GarsonDeletedPublisher extends Publisher<GarsonDeletedEvent> {
  readonly subject = Subjects.GarsonDeleted;
}
