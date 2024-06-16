const express = require('express');
const { createCategory, getAllCategory, getCategory, updateCategory, deleteCategory } = require('../controllers/category_controller');
const router = express.Router();

router.post('/create', createCategory);//ok
router.get('/getAllcategory', getAllCategory);//ok
router.get('/getCategory/:ctid', getCategory);//ok
router.put('/updateCategory/:ctid', updateCategory);//chua check
router.delete('/deleteCategory/:ctid', deleteCategory);//ok

module.exports = router;