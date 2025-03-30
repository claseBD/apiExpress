(function () {
  "use strict";

  module.exports = {
    init: init,
    seedMenuItems: seedMenuItems,
  };

  var mongoose = require("mongoose");

  var mongodbConfig = require("../../mongodb/mongodb-config.json").mongodb;
  var menuItemsModel = require("../menuItem/menuItem.model");
  var json = require("../../mongodb/seeddMenuItems.json");

  function init() {
    var options = {
      promiseLibrary: require("bluebird"),
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    var connectionString = prepareConnectionString(mongodbConfig);

    mongoose
      .connect(connectionString, options)
      .then(function (result) {
        console.log("MongoDB connection successful. DB: " + connectionString);
      })
      .catch(function (error) {
        console.log(error.message);
        console.log(
          "Error occurred while connecting to DB: : " + connectionString,
        );
      });
  }

  function prepareConnectionString(config) {
    var connectionString = "mongodb://";

    if (config.user) {
      connectionString += config.user + ":" + config.password + "@";
    }

    connectionString += config.server + "/" + config.database;

    return connectionString;
  }

  function seedMenuItems() {
    menuItemsModel
      .deleteMany({})
      .then(function () {
        return menuItemsModel.insertMany(json);
      })
      .then(function () {
        console.log("Menu items seeded successfully.");
      })
      .catch(function (error) {
        console.log(error.message);
        console.log("Error occurred while seeding menu items.");
      });
  }
})();
