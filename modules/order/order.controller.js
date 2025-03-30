(function () {
    "use strict";

    const express = require("express");
    const router = express.Router();
    const { addOrder, getOrders, getOrderById, modifyOrder, removeOrder } = require("./order.module")().OrderMiddleware;

    router.post("/", addOrder, (req, res) => res.status(201).json(req.response));
    router.get("/", getOrders, (req, res) => res.status(200).json(req.response));
    router.get("/:orderId", getOrderById, (req, res) => res.status(200).json(req.response));
    router.put("/:orderId", modifyOrder, (req, res) => res.status(200).json(req.response));
    router.delete("/:orderId", removeOrder, (req, res) => res.status(200).json(req.response));

    module.exports = router;
})();
