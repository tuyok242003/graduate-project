/* eslint-disable prettier/prettier */
import asyncHandler from "../middleware/asyncHandler.js"
import generateToken from "../utils/generateToken.js"
import User from "../models/userModel.js"
import crypto from "crypto"
// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id)

    res.json({
      _id: user._id,
      userName: user.userName,
      email: user.email,
      isAdmin: user.isAdmin
    })
  } else {
    res.status(401)
    throw new Error("Invalid email or password")
  }
})

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }

  // Tạo mã thông báo và thời gian hết hạn
  const resetToken = crypto.randomBytes(20).toString("hex")
  user.passwordResetToken = resetToken
  user.passwordResetExpires = Date.now() + 60 * 60 * 1000 // 1 giờ

  await user.save()

  // Gửi email với liên kết đặt lại mật khẩu
  const resetURL = `http://your-app-url/reset-password/${resetToken}`

  // Bạn cần triển khai hàm gửi email của bạn ở đây, có thể sử dụng nodemailer hoặc dịch vụ gửi email khác
  // Ví dụ: sendEmail(user.email, 'Reset Your Password', resetURL);
  const emailSubject = "Reset Your Password"
  const emailText = `Click the following link to reset your password: ${resetURL}`

  // Sử dụng hàm gửi email

  res.status(200).json({ message: "Email sent with password reset instructions" })
})
// const resetPassword = asyncHandler(async (req, res) => {
//   const { name, email, password } = req.body;
//   const randomPassword = Math.random().toString(36).slice(-8);
//   const hashedPassword = await bcrypt.hash(randomPassword, 10);

//   const userExists = await User.findOne({ email });

//   if (!userExists) {
//     res.status(400);
//     throw new Error('User already exists');
//   }

//   userExists.name = name;
//   userExists.password = hashedPassword;

//   const updatedUser = await userExists.save();
//   if (updatedUser) {
//     res.status(201).json({
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       isAdmin: updatedUser.isAdmin,
//     });
//   } else {
//     res.status(400);
//     throw new Error('Invalid user data');
//   }
// });
// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error("User already exists")
  }

  const user = await User.create({
    userName,
    email,
    password
  })

  if (user) {
    generateToken(res, user._id)

    res.status(201).json({
      _id: user._id,
      userName: user.userName,
      email: user.email,
      isAdmin: user.isAdmin
    })
  } else {
    res.status(400)
    throw new Error("Invalid user data")
  }
})
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.userName = req.body.userName || user.userName
    user.email = req.body.email || user.email

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      userName: updatedUser.userName,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})
// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0)
  })
  res.status(200).json({ message: "Logged out successfully" })
}

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      userName: user.userName,
      email: user.email,
      isAdmin: user.isAdmin
    })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    if (user.isAdmin) {
      res.status(400)
      throw new Error("Can not delete admin user")
    }
    await User.deleteOne({ _id: user._id })
    res.json({ message: "User removed" })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password")

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})
// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.userName = req.body.userName || user.userName
    user.email = req.body.email || user.email
    user.isAdmin = Boolean(req.body.isAdmin)

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      userName: updatedUser.userName,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  forgotPassword
}
