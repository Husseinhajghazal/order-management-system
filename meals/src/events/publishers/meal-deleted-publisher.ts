import { Publisher, MealDeletedEvent, Subjects } from "@husseintickets/common";

export class MealDeletedPublisher extends Publisher<MealDeletedEvent> {
  readonly subject = Subjects.MealDeleted;
}
