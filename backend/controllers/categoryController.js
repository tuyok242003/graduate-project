/* eslint-disable prettier/prettier */
import asyncHandler from '../middleware/asyncHandler.js';
import Category from '../models/categoryModel.js';
const getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    return res.json(category);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});
const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Danh mục đã tồn tại' });
    }
    const category = await Category.create({
      name,
    });

    return res.status(202).json({
      message: 'Thêm bài Danh mục thành công',
      category,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm danh mục' });
  }
});
const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const category = await Category.findById(req.params.id);

  if (category) {
    category.name = name;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await Category.deleteOne({ _id: category._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});
export { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
