const express = require('express');
const { createOrder, getAllOrder, getOrder, updateOrder, deleteOrder } = require('../controllers/order_controller');
const router = express.Router();

router.post('/createOrder', createOrder);//ok
router.get('/getAllOrder', getAllOrder);//ok
router.get('/getOrder/:oid', getOrder);//ok
router.put('/updateOrder/:oid', updateOrder);
router.delete('/deleteOrder/:oid', deleteOrder);//ok

module.exports = router;
