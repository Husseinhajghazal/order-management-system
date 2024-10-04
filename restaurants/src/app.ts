import "express-async-errors";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { errorHandler, noRoute } from "@husseintickets/common";

import { restaurantRouter } from "./api/restaurant/router";
import { natsWrapper } from "./nats-wrapper";

const app = express();

app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());
app.use(express.json());

app.use("/api/v1/restaurants", restaurantRouter);

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
    throw new Error("NATS_CLUSTER_ID tanımlı olmalı");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL tanımlı olmalı");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_URL tanımlı olmalı");
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
    process.on("SIGNT", () => natsWrapper.client.close());
    process.on("SIGNTERM", () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URL);
  } catch (error) {
    console.log(error);
  }
  app.listen(3000, () => {
    console.log("3000 numaralı porttan dinliyoruz!");
  });
};

start();
