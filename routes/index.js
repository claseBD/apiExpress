var express = require("express");
var router = express.Router();
var order = require("../modules/order/order.module");
var menuItem = require("../modules/menuItem/menuItem.module");

router.get("/view", function (req, res, next) {
  res.render("pages/index");
});

router.use("/order", order().OrderController);
router.use("/menuItem", menuItem().MenuItemController);

module.exports = router;
