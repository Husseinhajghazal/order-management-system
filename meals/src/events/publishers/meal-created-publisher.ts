import { Publisher, MealCreatedEvent, Subjects } from "@husseintickets/common";

export class MealCreatedPublisher extends Publisher<MealCreatedEvent> {
  readonly subject = Subjects.MealCreated;
}
