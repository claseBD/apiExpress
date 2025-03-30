(function () {
  "use strict";

  module.exports = {
    createMenuItem,
    fetchMenuItems,
    fetchMenuItemsByFilter,
    updateMenuItem,
    deleteMenuItem,
  };

  var MenuItemModel = require("./menuItem.module")().MenuItemModel;

  function createMenuItem(menuItem) {
    try {
      return MenuItemModel.create(menuItem);
    } catch (error) {
      console.error(error);
    }
  }

  function fetchMenuItems() {
    return MenuItemModel.find({}).exec();
  }

  function fetchMenuItemsByFilter(itemId) {
    return MenuItemModel.findById(itemId).exec();
  }

  function updateMenuItem(menuItemId, menuItem) {
    return MenuItemModel.findByIdAndUpdate(menuItemId, menuItem, {
      new: true,
    }).exec();
  }

  function deleteMenuItem(menuItemId) {
    return MenuItemModel.findByIdAndRemove(menuItemId).exec();
  }
})();
