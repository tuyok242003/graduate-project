import express from 'express';
const router = express.Router();
import {
    createVoucher,
    getVouchers,
    getVoucherById,
    deleteVoucher,
    updateVoucher
} from '../controllers/voucherController.js';
router.route('/').get(getVouchers);
router.route('/:id').get(getVoucherById);
router.post('/', createVoucher);
router.delete('/:id', deleteVoucher)
router.put('/:id', updateVoucher)
export default router;