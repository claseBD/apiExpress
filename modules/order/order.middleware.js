(function () {
    "use strict";

    const OrderService = require("./order.module")().OrderService;

    module.exports = {
        addOrder,
        getOrders,
        getOrderById,
        modifyOrder,
        removeOrder
    };

    function handleRequest(promise, req, next) {
        promise
            .then(data => {
                req.response = data;
                next();
            })
            .catch(next);
    }

    function addOrder(req, res, next) {
        handleRequest(OrderService.createOrder(req.body), req, next);
    }

    function getOrders(req, res, next) {
        handleRequest(OrderService.getOrders(), req, next);
    }

    function getOrderById(req, res, next) {
        handleRequest(OrderService.fetchOrders(req.params.userId), req, next);
    }

    function modifyOrder(req, res, next) {
        handleRequest(OrderService.updateOrder(req.params.userId, req.body), req, next);
    }

    function removeOrder(req, res, next) {
        handleRequest(OrderService.deleteOrder(req.params.userId), req, next);
    }
})();
