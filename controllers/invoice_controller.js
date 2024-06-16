const Invoice = require('../Models/invoice');
const db = require('../Models');
const InvoiceDetail = require('../Models/invoicedetail');
const asyncHandler = require('express-async-handler');

const createInvoice = asyncHandler(async (req, res) => {
    const { invoiceData, invoiceDetailData } = req.body;

    const t = await sequelize.transaction();
    try {
        const invoice = await db.Invoice.create(invoiceData, { transaction: t });

        // Tạo các chi tiết hóa đơn
        for (const item of invoiceDetailData) {
            await InvoiceDetail.create({
                InvoiceID: invoice.InvoiceID,
                ProductID: item.ProductID,
                Quantity: item.Quantity,
            }, { transaction: t });
        }

        await t.commit();
        res.status(201).json(invoice);
    } catch (error) {
        // Rollback transaction nếu có lỗi
        await t.rollback();
        res.status(400).json({ error: error.message });
    }
});

const getInvoice = asyncHandler(async (req, res) => {
    const { iid } = req.params;
    try {
        const invoice = await db.Invoice.findByPk(iid, {
            include: [InvoiceDetail]
        });
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const getAllInvoice = asyncHandler(async (req, res) => {
    try {
        const invoices = await db.Invoice.findAll({
            include: [InvoiceDetail]
        });
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const updateInvoice = asyncHandler(async (req, res) => {
    const { iid } = req.params;
    const { invoiceData, invoiceDetailData } = req.body;
    const t = await sequelize.transaction();

    try {
        const invoice = await db.Invoice.findByPk(iid, { transaction: t });
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        await db.invoice.update(invoiceData, { transaction: t });

        // Xóa các chi tiết hóa đơn cũ
        await db.InvoiceDetail.destroy({
            where: { InvoiceID: iid },
            transaction: t
        });

        // Tạo các chi tiết hóa đơn mới
        for (const item of invoiceDetailData) {
            await db.InvoiceDetail.create({
                InvoiceID: invoice.InvoiceID,
                ProductID: item.ProductID,
                Quantity: item.Quantity,
            }, { transaction: t });
        }

        // Commit transaction
        await t.commit();

        res.status(200).json(invoice);
    } catch (error) {
        // Rollback transaction nếu có lỗi
        await t.rollback();
        res.status(400).json({ error: error.message });
    }
});

const deleteInvoice = asyncHandler(async (req, res) => {
    const { iid } = req.params;
    const t = await sequelize.transaction();

    try {
        const invoice = await db.Invoice.findByPk(iid, { transaction: t });
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        // Xóa các chi tiết hóa đơn
        await db.InvoiceDetail.destroy({
            where: { InvoiceID: iid },
            transaction: t
        });

        // Xóa hóa đơn
        await db.invoice.destroy({ transaction: t });

        // Commit transaction
        await t.commit();

        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        // Rollback transaction nếu có lỗi
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
});

module.exports = {
    createInvoice,
    getInvoice,
    getAllInvoice,
    updateInvoice,
    deleteInvoice
};
