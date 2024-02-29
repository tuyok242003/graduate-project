import asyncHandler from '../middleware/asyncHandler.js';
import Category from '../models/categoryModel.js';
const getCategories = asyncHandler(async(req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
const getCategoryById = asyncHandler(async(req, res) => {
    const category = await Category.findById(req.params.id);
    if (category) {
        return res.json(category);
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});
const createCategory = asyncHandler(async(req, res) => {
    const { categoryName } = req.body;
    const category = new Category({
        categoryName,
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
});
const updateCategory = asyncHandler(async(req, res) => {
    const { categoryName } = req.body;

    const category = await Category.findById(req.params.id);

    if (category) {
        category.categoryName = categoryName;

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});
const deleteCategory = asyncHandler(async(req, res) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        await Category.deleteOne({ _id: category._id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});
export {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};