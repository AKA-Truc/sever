const express = require('express');
const { createCustomer, getAllCustomer, getCustomer, updateCustomer, deleteCustomer } = require('../controllers/customer_controller');
const router = express.Router();

router.post('/createCustomer', createCustomer);//ok
router.get('/getAllCustomer', getAllCustomer);//ok
router.get('/getCustomer/:cid', getCustomer);//ok
router.put('/updateCustomer/:cid', updateCustomer);
router.delete('/deleteCustomer/:cid', deleteCustomer);//ok


module.exports = router;
