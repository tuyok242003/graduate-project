import asyncHandler from '../middleware/asyncHandler.js';
import Contact from '../models/contactModel.js';
// import { ContactSchema } from "../schemas/Contact.js";
// @desc  Fetch all products
// @route GET /api/products
// @acess public
const createContact = asyncHandler(async (req, res) => {
  const { contactName, phone, email, content } = req.body;

  const contact = await Contact.create({
    contactName,
    phone,
    email,
    content,
  });
  return res.json({
    message: 'Thêm liên hệ thành công',
    contact,
  });
});

const getContacts = asyncHandler(async (req, res) => {
  try {
    const contacts = await Contact.find({});
    res.json(contacts);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// @desc  Fetch a products
// @route GET /api/products/:id
// @acess public

const getContactById = asyncHandler(async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(400).json({
        message: 'Không tìm thấy contact',
      });
    }
    return res.json({
      message: 'Lấy contact thành công',
      contact,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});
const updateContact = asyncHandler(async (req, res) => {
  const { contactName, email, phone, content } = req.body;

  const contact = await Contact.findById(req.params.id);

  if (contact) {
    contact.contactName = contactName;
    contact.email = email;
    contact.phone = phone;
    contact.content = content;

    const updatedContact = await contact.save();
    res.json(updatedContact);
  } else {
    res.status(404);
    throw new Error('Contact not found');
  }
});
const deleteContact = asyncHandler(async (req, res) => {
  try {
    const contactId = req.params.id;
    const contact = await Contact.findByIdAndDelete(contactId);

    if (!contact) {
      return res.status(400).json({
        message: 'Không tìm thấy bài viết',
      });
    }

    return res.json({
      message: 'Xóa bài viết thành công',
      contact,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});
export {
  getContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
};
