import { Publisher, OrderCreatedEvent, Subjects } from "@husseintickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
