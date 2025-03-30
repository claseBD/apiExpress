(function () {
  var mongoose = require("mongoose");

  var Schema = mongoose.Schema;

  var OrderSchema = new Schema({
    id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "menuItems",
        required: true,
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    address: String,
    city: String,
    state: String,
    zipCode: String,
  });

  module.exports = mongoose.model("orders", OrderSchema);
})();