import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';

const getProducts = asyncHandler(async(req, res) => {
    const pageSize = process.env.PAGINATION_LIMIT;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i',
        },
    } : {};

    const count = await Product.countDocuments({...keyword });
    const products = await Product.find({...keyword })
        .populate('category')
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

const getProductById = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        return res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

const createProduct = asyncHandler(async(req, res) => {
    const { name, image, brand, description, numReviews, price, category } = req.body;
    let existingCategory = await Category.findOne({ name: category });

    if (!existingCategory) {
        existingCategory = new Category({ name: category });
        await existingCategory.save();
    }
    const product = new Product({
        name,
        user: req.user._id,
        price,
        brand,
        image,
        category: existingCategory.name,
        numReviews,
        description,

    });

    const createdProduct = await product.save();
    res.status(200).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async(req, res) => {
    const { name, description, image, brand, category, price } = req.body;

    const product = await Product.findById(req.params.id);
    let existingCategory = await Category.findOne({ name: category });

    if (!existingCategory) {
        existingCategory = new Category({ name: category });
        await existingCategory.save();
    }

    if (product) {
        product.name = name;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = existingCategory._id; // Sử dụng ObjectId của existingCategory
        product.price = price
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});


// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async(req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

const getTopProducts = asyncHandler(async(req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);

    res.json(products);
});
const addVariant = asyncHandler(async(req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const { color, price, title, thumb, images, countInStock, quantitySold, discount } =
    req.body;
    if (!color || !price || !title || !thumb || !countInStock || !quantitySold) {
        res.status(400);
        throw new Error('Missing required fields');
    }

    const product = await Product.findById(id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (!product.variants) {
        product.variants = [];
    }
    const discountAmount = (price * discount) / 100;
    const discountedPrice = price - discountAmount;
    product.variants.push({
        productId: id,
        color,
        price: discountedPrice,
        title,
        thumb,
        images,
        countInStock,
        quantitySold,
        discount
    });
    const updatedProduct = await product.save();

    return res.status(200).json({
        status: true,
        response: updatedProduct,
    });
});
const updateVariant = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { variantIndex, color, price, title, thumb, images, countInStock } =
    req.body.variants[0];
    if (
        variantIndex === undefined ||
        color === undefined ||
        price === undefined ||
        title === undefined ||
        thumb === undefined ||
        countInStock === undefined ||
        images === undefined
    ) {
        res.status(400);
        throw new Error('Missing required fields');
    }

    const product = await Product.findById(id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    const variantToUpdate = product.variants[variantIndex];

    if (!variantToUpdate) {
        res.status(404);
        throw new Error('Variant not found');
    }

    // Update variant properties
    variantToUpdate.color = color || variantToUpdate.color;
    variantToUpdate.price = price || variantToUpdate.price;
    variantToUpdate.title = title || variantToUpdate.title;
    variantToUpdate.thumb = thumb || variantToUpdate.thumb;
    variantToUpdate.countInStock = countInStock || variantToUpdate.countInStock;
    variantToUpdate.images = images || variantToUpdate.images;

    const updatedProduct = await product.save();

    return res.status(200).json({
        status: true,
        response: updatedProduct,
    });
});
const getProductsByCategory = asyncHandler(async(req, res) => {
    const pageSize = process.env.PAGINATION_LIMIT;
    const page = Number(req.query.pageNumber) || 1;
    const categoryId = req.params.categoryId;

    const keyword = req.query.keyword ? {
        categoryName: {
            $regex: req.query.keyword,
            $options: 'i',
        },
    } : {};

    const count = await Product.countDocuments({
        category: categoryId,
        ...keyword,
    });
    const products = await Product.find({ category: categoryId, ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getTopProducts,
    addVariant,
    updateVariant,
    getProductsByCategory,
};