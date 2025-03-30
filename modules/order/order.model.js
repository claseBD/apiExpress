(function (){
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var OrderSchema = new mongoose.Schema({
        orderId:{
            type: mongoose.Schema.Types.ObjectId,
            require: true
        },
        products:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "menuItems",
            require:true
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        phoneNumber:{
            type:Number,
            require:true
        },
        address:{type:String},
        city:{type:String},
        state:{type:String},
        zipCode:{type:String}
    });
    module.exports = mongoose.model('order', orderSchema);
});



