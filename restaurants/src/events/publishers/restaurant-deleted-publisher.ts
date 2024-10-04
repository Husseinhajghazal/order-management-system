import {
  Publisher,
  RestaurantDeletedEvent,
  Subjects,
} from "@husseintickets/common";

export class RestaurantDeletedPublisher extends Publisher<RestaurantDeletedEvent> {
  readonly subject = Subjects.RestaurantDeleted;
}
