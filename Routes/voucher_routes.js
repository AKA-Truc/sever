const express = require('express');
const { createNewVoucher, getAllVouchers, getVoucher, updateVoucher, deleteVoucher } = require('../controllers/voucher_controller');
const router = express.Router();

router.post('/createNewVoucher',createNewVoucher);//ok
router.get('/getAllVouchers',getAllVouchers);//ok
router.get('/getVoucher/:vpid',getVoucher);//ok
router.put('/updateVoucher/:vpid',updateVoucher);
router.delete('/deleteVoucher/:vpid',deleteVoucher);//ok

module.exports = router;