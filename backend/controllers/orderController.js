import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { calcPrices } from '../utils/calcPrices.js';
import { getVerifyPayPalPayment, getCheckIfNewTransaction } from '../utils/paypal.js';
import Voucher from '../models/voucherModel.js';
const updateQuantitySold = async(variantId, quantity) => {
    try {
        const product = await Product.findOne({ 'variants._id': variantId });
        if (product) {
            // Cập nhật quantitySold cho từng variant
            await Product.findOneAndUpdate({ 'variants._id': variantId }, {
                $inc: {
                    'variants.$.quantitySold': quantity,
                    'variants.$.countInStock': -quantity,
                },
            }, { new: true });
            console.log('variantId:', variantId);
        }
    } catch (error) {
        console.error('Error updating quantity sold:', error.message);
    }
};
// const updateQuantitySoldVoucher = async(voucherId, qty) => {
//     try {
//         const voucher = await Voucher.findOne({ 'vouchers._id': voucherId });
//         if (voucher) {

//             await Voucher.findOneAndUpdate({ 'vouchers._id': voucherId }, {
//                 $inc: {
//                     'vouchers.$.quantitySold': qty,
//                     'vouchers.$.qty': -qty,
//                 },
//             }, { new: true });
//             console.log('voucherId:', voucherId);
//         }
//     } catch (error) {
//         console.error('Error updating quantity sold:', error.message);
//     }
// };
const addOrderItems = asyncHandler(async(req, res) => {
    const { orderItems, shippingAddress, paymentMethod, voucherName } = req.body;
    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }
    try {
        const dbOrderItems = orderItems.map((itemFromClient) => ({
            ...itemFromClient,
            product: itemFromClient._id,
            price: itemFromClient.price,
            _id: undefined,
        }));
        const { itemsPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems);
        let discountedTotalPrice = totalPrice;
        if (voucherName) {
            const voucher = await Voucher.findOne({ name: voucherName });
            if (!voucher) {
                res.status(400).json({ message: 'Voucher not found.' });
                return;
            }
            if (voucher.isUsed) {
                res.status(400).json({ message: 'Voucher has already been used.' });
                return;
            }
            if (voucher.expiryDate && new Date(voucher.expiryDate) < new Date()) {
                res.status(400).json({ message: 'Voucher has expired.' });
                return;
            }
            discountedTotalPrice = totalPrice - (voucher.discountAmount / 100) * totalPrice;
            await Voucher.findByIdAndUpdate(voucher._id, { isUsed: true });
        }
        const order = new Order({
            orderItems: orderItems.map((item) => ({...item, name: item.color })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            voucherName: voucherName,
            totalPrice: discountedTotalPrice,
        });
        console.log(order)
        const createdOrder = await order.save();
        for (const orderItem of createdOrder.orderItems) {
            await updateQuantitySold(orderItem.id, orderItem.qty);
            // await updateQuantitySoldVoucher(orderItem.id, orderItem.qty)
        }
        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
const getMyOrders = asyncHandler(async(req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});
const getOrderById = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );
    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});
const updateOrderToPaid = asyncHandler(async(req, res) => {
    const { verified, value } = await getVerifyPayPalPayment(req.body.id);
    if (!verified) throw new Error('Payment not verified');
    const isNewTransaction = await getCheckIfNewTransaction(Order, req.body.id);
    if (!isNewTransaction) throw new Error('Transaction has been used before');
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isPaid = true;
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };
        order.paidAt = Date.now();
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});
const updateOrderToDelivered = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});
const getOrders = asyncHandler(async(req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
});
const cancelOrder = asyncHandler(async(req, res) => {
    const orderId = req.params.id;
    try {

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(400).json({
                message: 'Không tìm thấy hoá đơn',
            });
        }
        order.isCancelled = true;
        await order.save();
        return res.json({
            message: 'Xoá bài viết thành công',
            order,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
});
const deleteOrder = asyncHandler(async(req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findByIdAndDelete(orderId);
        if (!order) {
            return res.status(400).json({
                message: 'Không tìm thấy đơn hàng',
            });
        }
        return res.json({
            message: 'Xóa đơn hàng thành công',
            order,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
});
const confirmOrder = asyncHandler(async(req, res) => {
    const orderId = req.params.id;
    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(400).json({
                message: 'Không tìm thấy đơn hàng',
            });
        }
        if (order.isConfirmed) {
            return res.status(400).json({
                message: 'Đơn hàng đã được xác nhận trước đó',
            });
        }
        order.isConfirmed = true;
        await order.save();
        return res.json({
            message: 'Xác nhận đơn hàng thành công',
            order,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
});
export {
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
};