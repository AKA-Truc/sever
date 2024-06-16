const express = require('express');
const { createEmployee, getAllEmployee, getEmployee, updateEmployee, deleteEmployee } = require('../controllers/employee_controller');
const router = express.Router();

router.post('/createEmployee', createEmployee);//ok
router.get('/getAllEmployee', getAllEmployee);//ok
router.get('/getEmployee/:eid', getEmployee);//ok
router.put('/updateEmployee/:eid', updateEmployee);
router.delete('/deleteEmployee/:eid', deleteEmployee);//ok

module.exports = router;
