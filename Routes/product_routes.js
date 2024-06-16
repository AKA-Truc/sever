const express = require('express');
const { createProduct, getAllProduct, getProduct, updateProduct, deleteProduct, uploadImageProduct } = require('../controllers/product_controller');
const router = express.Router();

router.post('/createProduct', createProduct);//ok
router.get('/getAllProduct', getAllProduct);//ok
router.get('/getProduct/:pid', getProduct);//ok
router.put('/updateProduct/:pid', updateProduct);
router.delete('/deleteProduct/:pid', deleteProduct);//ok
router.put('/uploadImageProduct/:pid',uploadImageProduct);

module.exports = router;
