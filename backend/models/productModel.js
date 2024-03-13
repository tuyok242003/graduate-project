import mongoose from 'mongoose';
const reviewSchema = mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
}, {
    timestamps: true,
});

const productSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category',
    },
    description: {
        type: String,
        required: true,
    },
    reviews: [reviewSchema],
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0,
    },
    variants: [{
        productId: String,
        color: String,
        price: Number,
        thumb: String,
        images: String,
        title: String,
        countInStock: Number,
        quantitySold: { type: Number, required: true, default: 0 },
        discount: { type: Number, default: 0 }
    }, ],
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;