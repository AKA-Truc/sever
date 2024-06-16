const express = require('express');
const { createInvoice, getAllInvoice, getInvoice, updateInvoice, deleteInvoice } = require('../controllers/invoice_controller');
const router = express.Router();

router.post('/createInvoice', createInvoice);
router.get('/getAllInvoice', getAllInvoice);
router.get('/getInvoice/:iid', getInvoice);
router.put('/updateInvoice/:iid', updateInvoice);
router.delete('/deleteInvoice/:iid', deleteInvoice);

module.exports = router;
