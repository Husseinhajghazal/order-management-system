import { Publisher, MealUpdatedEvent, Subjects } from "@husseintickets/common";

export class MealUpdatedPublisher extends Publisher<MealUpdatedEvent> {
  readonly subject = Subjects.MealUpdated;
}
