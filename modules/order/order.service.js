(function () {
    "use strict";

    module.exports = {
        createOrder,
        fetchOrders,
        fetchOrderByFilter,
        updateOrder,
        deleteOrder,
    };

    const OrderModel = require("./order.module")().OrderModel;
    const unknownError = require('./error-unknown.json');
    const error404 = require('./error-404.json');

    async function createOrder(user) {
        try {
            const order = await OrderModel.create(user);
            if (!order) throw error404;
            return order;
        } catch (error) {
            throw unknownError;
        }
    }

    async function fetchOrders() {
        try {
            const orders = await OrderModel.find({});
            if (!orders || orders.length === 0) throw error404;
            return orders;
        } catch (error) {
            throw unknownError;
        }
    }

    async function fetchOrderByFilter(userId) {
        try {
            const order = await OrderModel.findById(userId);
            if (!order) throw error404;
            return order;
        } catch (error) {
            throw unknownError;
        }
    }

    async function updateOrder(userId, user) {
        try {
            const updatedOrder = await OrderModel.findByIdAndUpdate(userId, user, { new: true });
            if (!updatedOrder) throw error404; 
            return updatedOrder;
        } catch (error) {
            throw unknownError;
        }
    }

    async function deleteOrder(orderId) {
        try {
            const deletedOrder = await OrderModel.findByIdAndRemove(orderId);
            if (!deletedOrder) throw error404;
            return deletedOrder;
        } catch (error) {
            throw unknownError;
        }
    }
})();



