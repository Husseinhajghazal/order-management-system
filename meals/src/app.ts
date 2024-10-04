import "express-async-errors";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import { errorHandler, noRoute } from "@husseintickets/common";
import { mealRouter } from "./api/meal/router";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { RestaurantDeletedListener } from "./events/listeners/restaurant-deleted-listener";

const app = express();

app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());
app.use(express.json());

app.use("/api/v1/meals", mealRouter);

app.use(noRoute);
app.use(errorHandler);

const start = async () => {
  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL tanımlı olmalı");
  }
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET tanımlı olmalı");
  }
  if (!process.env.CLOUD_NAME) {
    throw new Error("CLOUD_NAME tanımlı olmalı");
  }
  if (!process.env.CLOUD_API_KEY) {
    throw new Error("CLOUD_API_KEY tanımlı olmalı");
  }
  if (!process.env.CLOUD_API_SECRET) {
    throw new Error("CLOUD_API_SECRET tanımlı olmalı");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_URL must be defined");
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS bağlantısı kapatıldı!");
      process.exit();
    });
    await mongoose.connect(process.env.MONGO_URL);
    new OrderCreatedListener(natsWrapper.client).listen();
    new RestaurantDeletedListener(natsWrapper.client).listen();
  } catch (error) {
    console.log(error);
  }
  app.listen(3000, () => {
    console.log("3000 numaralı porttan dinliyoruz!");
  });
};

start();
