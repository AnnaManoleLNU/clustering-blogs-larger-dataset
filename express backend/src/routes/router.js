import express from "express";
import createError from "http-errors";
import { routerAPI } from "./api/router.js";

export const router = express.Router();

router.get("/", (req, res) =>
  res.status(200).send({
    status: "OK",
    message: "Clustering system up and running.",
  })
);

// Mount the API version 1.
router.use("/", routerAPI);

// Catch 404 (ALWAYS keep this as the last route).
router.use("*", (req, res, next) => next(createError(404)));
