import express from 'express';
const router = express.Router();
import asyncHandler from '../middleware/asyncHandler.js';

import {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders,
    cancelOrder,
    deleteOrder,
    confirmOrder,
    updateQuantitySold,

    // confirmPayment,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/mine').get(protect, getMyOrders);
router
    .route('/:id')
    .get(protect, getOrderById)
    .put(protect, admin, cancelOrder);
router
    .route('/:id')
    .get(protect, getOrderById)
    .delete(protect, admin, deleteOrder);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/confirm').put(protect, confirmOrder);
router.route('/update/:id/:quantity').put((req, res) => {
    updateQuantitySold(req.params.id, req.params.quantity);
    res.json({ message: 'Quantity updated successfully' });
});
// router.route('/update/:id/:qty').put((req, res) => {
//     updateQuantitySoldVoucher(req.params.id, req.params.qty);
//     res.json({ message: 'Quantity voucher updated successfully' });
// });
// router.route('/:id/confirmPayment').put(protect, asyncHandler(confirmPayment));

// router.get(
//   '/cancelled',
//   asyncHandler(async (req, res) => {
//     const cancelledOrders = await Order.find({ isCancelled: true });
//     res.json(cancelledOrders);
//   })
// );

export default router;