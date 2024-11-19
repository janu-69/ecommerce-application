const mongoose = require('mongoose');

const orderschema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    userName: { type: String, required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        pricePerProduct: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        sellerId:{type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
      }
    ],
    totalAmount: { type: Number, required: true },
    orderStatus: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      district: { type: String, required: true },
      postalCode: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'] }
  })


const ordermodel=new mongoose.model("orders",orderschema);

module.exports=ordermodel