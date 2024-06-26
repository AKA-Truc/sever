const Customer = require('../Models/customer.js');
const db = require('../Models');
const asyncHandler = require('express-async-handler');
const { where } = require('sequelize');

const createCustomer = asyncHandler(async (req, res) => {
    const { Name, Phone ,Gender } = req.body;


    if (!Name || !Phone || !Gender ) {
        return res.status(400).json({
            success: false,
            mes: "Vui lòng nhập đầy đủ thông tin"
        });
    }

    if (Phone.length > 10 && Phone[0] == '0') {
        return res.status(400).json({
            success: false,
            mes: "Số điện thoại không hợp lệ"
        });
    }

    const customerExist = await db.Customer.findOne({ where: { Name, Phone ,Gender } });

    if (customerExist) {
        return res.status(400).json({
            success: false,
            message: "Khách hàng đã tồn tại trong danh sách"
        });
    }

    const newCustomer = await db.Customer.create(req.body);

    return res.status(201).json({
        success: true,
        newCustomer: newCustomer
    });
});

const getAllCustomer = asyncHandler(async (req, res) => {
    try {
        const listCustomer = await db.Customer.findAll();
        return res.status(200).json({
            success: true,
            listCustomer: listCustomer
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

const getCustomer = asyncHandler(async(req, res) => {
    const { cid } = req.params;

    const customer = await db.Customer.findByPk(cid);

    if (customer) {
        return res.status(200).json({
            success: true,
            Customer: customer
        });
    } else {
        return res.status(404).json({
            success: false,
            message: "Khách hàng không có trong danh sách"
        });
    }
});

const updateCustomer = asyncHandler(async (req, res) => {
    const { cid } = req.params;

    try {
        // Tìm khách hàng theo ID
        const customer = await db.Customer.findByPk(cid);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Khách hàng không tồn tại"
            });
        }

        // Cập nhật thông tin khách hàng
        await customer.update(req.body);

        // Lấy thông tin khách hàng sau khi đã cập nhật
        const updatedCustomer = await db.Customer.findByPk(cid);

        return res.status(200).json({
            success: true,
            updatedCustomer
        });
    } catch (error) {
        console.error("Error in updateCustomer:", error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi khi cập nhật thông tin khách hàng"
        });
    }
});


const deleteCustomer = asyncHandler(async(req, res) => {
    const { cid } = req.params;

    const customer = await db.Customer.findByPk(cid);

    // Ktra xem khách hàng có tồn tại hay không
    if (!customer) {
        return res.status(404).json({ success: false, message: "Khách hàng không tồn tại" });
    }

    await db.Customer.destroy({where :{CustomerID: cid}});

    return res.status(200).json({
        success: true,
        message: `Đã xoá khách hàng ${customer.Name}`
    });
});

module.exports = {
    createCustomer,
    getAllCustomer,
    getCustomer,
    updateCustomer,
    deleteCustomer
}