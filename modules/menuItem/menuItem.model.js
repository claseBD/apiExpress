(function () {
  var mongoose = require("mongoose");

  var Schema = mongoose.Schema;

  var menuItemSchema = new Schema({
    id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  });

  module.exports = mongoose.model("menuItems", menuItemSchema);
})();
