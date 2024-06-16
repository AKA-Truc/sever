const Employee = require('../Models/employee');
const db = require('../Models');
const asyncHandler = require('express-async-handler');

const createEmployee = asyncHandler(async (req, res) => {
    const { Name, Phone ,Gender, Address, Role,Salary } = req.body;

    if (!Name || !Phone || !Gender || !Address || !Role || !Salary ) {
        return res.status(400).json({
            success: false,
            mes: "Vui lòng nhập đầy đủ thông tin"
        });
    }
    const employeeExist = await db.Employee.findOne({ where: {  Name, Phone ,Gender, Address, Role,Salary } });

    if (employeeExist) {
        return res.status(400).json({
            success: false,
            message: "Nhân viên đã tồn tại trong danh sách"
        });
    }

    const newEmployee = await db.Employee.create(req.body);

    return res.status(201).json({
        success: true,
        newEmployee: newEmployee
    });
});

const getAllEmployee = asyncHandler(async (req, res) => {
    try {
        const listEmployee = await db.Employee.findAll();
        return res.status(200).json({
            success: true,
            listEmployee: listEmployee
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

const getEmployee = asyncHandler(async(req, res) => {
    const { eid } = req.params;

    const employee = await db.Employee.findByPk(eid);

    if (Employee) {
        return res.status(200).json({
            success: true,
            Employee: employee
        });
    } else {
        return res.status(404).json({
            success: false,
            message: "Nhân viên không có trong danh sách"
        });
    }
});

const updateEmployee = asyncHandler(async(req, res) => {
    const { eid } = req.params;

    const Employee = await db.Employee.findByPk(eid);

    if (!Employee) {
        return res.status(404).json({
            success: false,
            message: "Nhân viên không tồn tại"
        });
    }

    await db.Employee.update(req.body);

    return res.status(200).json({
        success: true,
        updatedEmployee: Employee
    });
});

const deleteEmployee = asyncHandler(async (req, res) => {
    const { eid } = req.params;

    const employee = await db.Employee.findByPk(eid);

    // Kiểm tra xem nhân viên có tồn tại hay không
    if (!employee) {
        return res.status(404).json({ 
            success: false, 
            message: "Nhân viên không tồn tại" 
        });
    }

    await employee.destroy();

    return res.status(200).json({
        success: true,
        message: `Đã xoá nhân viên ${employee.Name}`
    });
});

module.exports = {
    createEmployee,
    getAllEmployee,
    getEmployee,
    updateEmployee,
    deleteEmployee
}