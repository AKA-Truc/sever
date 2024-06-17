const express = require('express');
const { createInvoice, getAllInvoice, getInvoice, updateInvoice } = require('../controllers/invoice_controller');
const router = express.Router();

router.post('/createInvoice', createInvoice);//ok
router.get('/getAllInvoice', getAllInvoice);//
router.get('/getInvoice/:iid', getInvoice);
router.put('/updateInvoice/:iid', updateInvoice);

module.exports = router;
