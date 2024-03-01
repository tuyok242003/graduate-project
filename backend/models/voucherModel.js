import mongoose from 'mongoose';
const voucherSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        require: true,
    },
    discountAmount: {
        type: Number,
        required: true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    qty: {
        type: Number,
        require: true
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
    quantitySold: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
});
const Voucher = mongoose.model('Voucher', voucherSchema);
export default Voucher;