import mongoose from 'mongoose';

const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    orderItems: [{
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        images: { type: String, required: true },
        price: { type: Number, required: true },
    }, ],
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },



}, {
    timestamps: true,
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;