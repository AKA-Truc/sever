const db = require('../Models');
const Voucher = require('../Models/voucher');
const asyncHandler = require('express-async-handler');

const createNewVoucher = asyncHandler(async (req, res) => {
    const { Name, Describes, Percent, Mincost, Maxcost, EXDate } = req.body;

    if (!Name || !Describes || !Percent || !Mincost || !Maxcost || !EXDate) {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng nhập đầy đủ thông tin'
        });
    }

    try {
        const response = await db.Voucher.create({
            Name: Name,
            Describes: Describes,
            Percent: Percent,
            Mincost: Mincost,
            Maxcost: Maxcost,
            EXDate: new Date(Date.now() + EXDate * 24 * 60 * 60 * 1000)
        });

        return res.status(200).json({
            success: true,
            newVoucher: response
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

const getAllVouchers = asyncHandler(async (req, res) => {
    const response = await db.Voucher.findAll({ attributes: { exclude: ['updatedAt'] } });

    return res.status(200).json({
        success: response ? true : false,
        listVoucher: response ? response : "Đã có lỗi xảy ra, vui lòng thử lại"
    });
});

const getVoucher = asyncHandler(async (req, res) => {
    const { vpid } = req.params;

    const response = await db.Voucher.findByPk(vpid);
    return res.status(200).json({
        success: response ? true : false,
        voucher: response ? response : "Đã có lỗi xảy ra, vui lòng thử lại"
    });
});

const updateVoucher = asyncHandler(async (req, res) => {
    const { vpid } = req.params;

    if (Object.keys(req.body).length === 0) {
        throw new Error("Vui lòng nhập đầy đủ thông tin");
    }

    if (req.body.EXDate) {
        const { EXDate } = req.body;
        req.body.EXDate = new Date(Date.now() + +EXDate * 24 * 60 * 60 * 1000);
    }

    const response = await db.Voucher.update(req.body, {
        where: { VoucherID: vpid },
        returning: true,
        plain: true
    });

    return res.status(200).json({
        success: response ? true : false,
        updatedVoucher: response ? response[1] : "Đã có lỗi xảy ra, vui lòng thử lại"
    });
});

const deleteVoucher = asyncHandler(async (req, res) => {
    const { vpid } = req.params;

    const response = await db.Voucher.destroy({
        where: { VoucherID: vpid }
    });

    return res.status(200).json({
        success: response ? true : false,
        deleteVoucher: response ? `Đã xoá mã voucher với ID ${vpid}` : "Đã có lỗi xảy ra, vui lòng thử lại"
    });
});

module.exports = {
    createNewVoucher,
    getAllVouchers,
    getVoucher,
    updateVoucher,
    deleteVoucher
};
