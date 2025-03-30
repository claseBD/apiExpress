(function () {
  "use strict";

  var express = require("express");
  var router = express.Router();

  var MenuItemMiddleware = require("./menuItem.module")().MenuItemMiddleware;

  router.post("/", MenuItemMiddleware.addMenuItem, function (req, res) {
    res.status(201).json(req.response);
  });

  router.get("/", MenuItemMiddleware.getMenuItems, function (req, res) {
    res.status(200).json(req.response);
  });

  router.get(
    "/:orderId",
    MenuItemMiddleware.getMenuItemById,
    function (req, res) {
      res.status(200).json(req.response);
    },
  );

  router.put(
    "/:orderId",
    MenuItemMiddleware.modifyMenuItem,
    function (req, res) {
      res.status(200).json(req.response);
    },
  );

  router.delete(
    "/:orderId",
    MenuItemMiddleware.removeMenuItem,
    function (req, res) {
      res.status(200).json(req.response);
    },
  );

  module.exports = router;
})();
