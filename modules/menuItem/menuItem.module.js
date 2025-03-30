(function () {
  "use strict";

  module.exports = init;

  function init() {
    return {
      MenuItemController: require("./menuItem.controller"),
      MenuItemMiddleware: require("./menuItem.middleware"),
      MenuItemService: require("./menuItem.service"),
      MenuItemModel: require("./menuItem.model"),
    };
  }
})();
