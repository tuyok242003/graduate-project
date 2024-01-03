import express from 'express';
const router = express.Router();
import {
  getContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
} from '../controllers/contactController.js';

router.route('/').get(getContacts);
router.route('/:id').get(getContactById);
router.post('/', createContact);
router.delete('/:id', deleteContact);
router.put('/:id', updateContact);

export default router;
