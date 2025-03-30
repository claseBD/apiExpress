(function () {
  "use strict";

  module.exports = {
    createOrder: createOrder,
    fetchOrders: fetchOrders,
    fetchOrderByFilter: fetchOrderByFilter,
    updateOrder: updateOrder,
    deleteOrder: deleteOrder,
  };

  var OrderModel = require("./order.module")().OrderModel;
  function createOrder(user) {
    return OrderModel.create(user);
  }

  function fetchOrders() {
    return OrderModel.find({}).exec();
  }

  function fetchOrderByFilter(userId) {
    return OrderModel.findById(userId).exec();
  }

  function updateOrder(userId, user) {
    return OrderModel.findByIdAndUpdate(userId, user, { new: true }).exec();
  }

  function deleteOrder(orderId) {
    return OrderModel.findByIdAndRemove(orderId).exec();
  }
})();
