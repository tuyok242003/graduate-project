import asyncHandler from '../middleware/asyncHandler.js';
import Voucher from "../models/voucherModel.js";
const createVoucher = asyncHandler(async(req, res) => {
    const { name, discountAmount, expiryDate, isUsed, qty, quantitySold } = req.body;

    const voucher = await Voucher.create({
        name,
        discountAmount,
        expiryDate,
        isUsed,
        qty,
        quantitySold
    });
    return res.json({
        message: 'Thêm voucher thành công',
        voucher,
    });
});

const getVouchers = asyncHandler(async(req, res) => {
    try {
        const vouchers = await Voucher.find({});
        res.json(vouchers);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
})
const getVoucherById = asyncHandler(async(req, res) => {
    const voucher = await Voucher.findById(req.params.id);
    if (voucher) {
        return res.json(voucher);
    } else {
        res.status(404);
        throw new Error('Voucher not found');
    }
})
const deleteVoucher = asyncHandler(async(req, res) => {
    try {
        const voucherId = req.params.id;
        const voucher = await Voucher.findByIdAndDelete(voucherId);

        if (!voucher) {
            return res.status(400).json({
                message: 'Không tìm thấy Voucher',
            });
        }

        return res.json({
            message: 'Xóa voucher thành công',
            voucher,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
});
const updateVoucher = asyncHandler(async(req, res) => {
    const { name, discountAmount, expiryDate, isUsed, qty, quantitySold } = req.body;

    const voucher = await Voucher.findById(req.params.id);

    if (voucher) {
        voucher.name = name;
        voucher.discountAmount = discountAmount;
        voucher.expiryDate = expiryDate;
        voucher.isUsed = isUsed
        voucher.qty = qty
        voucher.quantitySold = quantitySold
        const updatedVoucher = await voucher.save();
        res.json(updatedVoucher);
    } else {
        res.status(404);
        throw new Error('Voucher not found');
    }
});


export { createVoucher, getVouchers, getVoucherById, deleteVoucher, updateVoucher }