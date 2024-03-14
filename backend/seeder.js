/* eslint-disable prettier/prettier */
import mongoose from "mongoose"
import dotenv from "dotenv"
import colors from "colors"
import users from "./data/users.js"
import products from "./data/products.js"
import User from "./models/userModel.js"
import Product from "./models/productModel.js"
import Order from "./models/orderModel.js"
import connectDB from "./config/db.js"
import Contact from "./models/contactModel.js"
import contacts from "./data/contact.js"
import Post from "./models/postModel.js"
import posts from "./models/postModel.js"
import Category from "./models/categoryModel.js"
import categories from "./data/category.js"
import Voucher from "./models/voucherModel.js"
import vouchers from "./data/voucher.js"
dotenv.config()

connectDB()

const importData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()
    await Contact.deleteMany()
    await Post.deleteMany()
    await Category.deleteMany()
    await Voucher.deleteMany()
    const createdUsers = await User.insertMany(users)

    const adminUser = createdUsers[0]._id

    const sampleProducts = products.map(product => {
      return { ...product, user: adminUser }
    })
    const sampleCategories = categories.map(category => {
      return { ...category, user: adminUser }
    })
    const sampleContacts = contacts.map(contact => {
      return { ...contact }
    })
    const samplePosts = posts.map(post => {
      return { ...post }
    })
    const sampleVouchers = vouchers.map(voucher => {
      return { ...voucher }
    })
    await Category.insertMany(sampleCategories)
    await Product.insertMany(sampleProducts)
    await Contact.insertMany(sampleContacts)
    await Post.insertMany(samplePosts)
    await Voucher.insertMany(sampleVouchers)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Category.deleteMany()
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()
    await Contact.deleteMany()
    await Post.deleteMany()
    await Voucher.deleteMany()
    console.log("Data Destroyed!".red.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === "-d") {
  destroyData()
} else {
  importData()
}
