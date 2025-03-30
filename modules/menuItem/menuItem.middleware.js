(function () {
  "use strict";

  module.exports = {
    addMenuItem,
    getMenuItems,
    getMenuItemById,
    modifyMenuItem,
    removeMenuItem,
  };

  var MenuItemService = require("./menuItem.module")().MenuItemService;

  function addMenuItem(req, res, next) {
    MenuItemService.createMenuItem(req.body).then(success).catch(failure);

    function success(data) {
      req.response = data;
      next();
    }

    function failure(error) {
      console.error(error);
      next(error);
    }
  }

  function getMenuItems(req, res, next) {
    MenuItemService.fetchMenuItems().then(success).catch(failure);

    function success(data) {
      req.response = data;
      next();
    }

    function failure(err) {
      next(err);
    }
  }

  function getMenuItemById(req, res, next) {
    MenuItemService.fetchMenuItemsByFilter(req.params.menuItemId)
      .then(success)
      .catch(failure);

    function success(data) {
      req.response = data;
      next();
    }

    function failure(err) {
      next(err);
    }
  }

  function modifyMenuItem(req, res, next) {
    MenuItemService.updateMenuItem(req.params.menuItemId, req.body)
      .then(success)
      .catch(error);

    function success(data) {
      req.response = data;
      next();
    }

    function error(err) {
      next(err);
    }
  }

  function removeMenuItem(req, res, next) {
    MenuItemService.deleteMenuItem(req.params.menuItemId)
      .then(success)
      .catch(error);

    function success(data) {
      req.response = data;
      next();
    }

    function error(err) {
      next(err);
    }
  }
})();
