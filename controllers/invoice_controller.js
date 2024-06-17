const Invoice = require('../Models/invoice');
const Customer = require('../Models/customer');
const db = require('../Models');
const InvoiceDetail = require('../Models/invoicedetail');
const asyncHandler = require('express-async-handler');

const createInvoice = async (req, res) => {
    const { OrderID } = req.body;

    try {
        // Tìm đơn hàng và lấy các chi tiết đơn hàng
        const order = await db.Order.findByPk(OrderID, {
            include: [
                {
                    model: db.OrderDetail,
                    as: 'OrderDetail',
                    include: {
                        model: db.Product,
                        as: 'Product'
                    }
                }
            ]
        });

        if (!order) {
            return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
        }

        // Tính toán tổng chi phí từ các chi tiết đơn hàng
        let totalCost = 0;
        order.OrderDetail.forEach(detail => {
            const { Quantity, Product } = detail;
            const { Price } = Product;
            totalCost += Quantity * Price;
        });

        // Tạo một transaction để đảm bảo tính toàn vẹn của giao dịch
        const transaction = await db.sequelize.transaction();

        try {
            // Tạo một hóa đơn mới với CustomerID
            const newInvoice = await db.Invoice.create({
                OrderID: order.OrderID,
                CustomerID: order.CustomerID, // Thêm CustomerID vào đây
                InvoiceDate: order.OrderDate, // Lấy ngày hiện tại làm ngày tạo hóa đơn
                Totalcost: totalCost
            }, { transaction });

            // Tạo các chi tiết hóa đơn từ các chi tiết đơn hàng
            const invoiceDetailPromises = order.OrderDetail.map(async detail => {
                const { ProductID, Quantity } = detail;

                return db.InvoiceDetail.create({
                    InvoiceID: newInvoice.InvoiceID,
                    ProductID,
                    Quantity
                }, { transaction });
            });

            // Chờ tất cả các chi tiết hóa đơn được tạo xong
            await Promise.all(invoiceDetailPromises);

            // Commit transaction
            await transaction.commit();

            // Trả về phản hồi thành công với thông tin hóa đơn mới tạo
            res.status(201).json({ success: true, invoice: newInvoice });
        } catch (error) {
            // Nếu có lỗi trong quá trình tạo hóa đơn, rollback transaction
            await transaction.rollback();
            throw error; // Throw để bắt lỗi và xử lý ở ngoài
        }
    } catch (error) {
        console.error('Lỗi khi tạo hóa đơn:', error);
        res.status(500).json({ error: 'Lỗi khi tạo hóa đơn' });
    }
};




const getInvoice = asyncHandler(async (req, res) => {
    const { iid } = req.params;
    try {
        const invoice = await db.Invoice.findByPk(iid, {
            include: [
                {
                    model: db.InvoiceDetail,
                    as: 'InvoiceDetail',
                    include: [
                        {
                            model: db.Product,
                            as: 'Product'
                        }
                    ]
                },
                {
                    model: db.Customer,
                    as: 'Customer'
                }
            ]
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
            include: [
                {
                    model: db.InvoiceDetail,
                    as: 'InvoiceDetail', 
                    include: [
                        {
                            model: db.Product,
                            as: 'Product' 
                        }
                    ]
                },
                {
                    model: db.Customer,
                    as: 'Customer'
                }
            ]
        });
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


const updateInvoice = asyncHandler(async (req, res) => {
    const { iid } = req.params;
    const { invoiceData, invoiceDetailData } = req.body;
    const transaction = await db.sequelize.transaction();

    try {
        const invoice = await db.Invoice.findByPk(iid, { transaction });
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        // Update the invoice data
        await invoice.update(invoiceData, { transaction });

        // Delete old invoice details
        await db.InvoiceDetail.destroy({
            where: { InvoiceID: iid },
            transaction
        });

        // Create new invoice details
        const invoiceDetailPromises = invoiceDetailData.map(async (item) => {
            const { ProductID, Quantity } = item;

            if (!ProductID || !Quantity) {
                throw new Error('Missing required fields in invoice details');
            }

            // Find the product
            const product = await db.Product.findByPk(ProductID, { transaction });

            if (!product) {
                throw new Error(`Product with ID: ${ProductID} not found`);
            }

            // Check inventory
            if (product.Inventory < Quantity) {
                throw new Error(`Product with ID: ${ProductID} does not have enough inventory`);
            }

            // Update inventory
            product.Inventory -= Quantity;
            await product.save({ transaction });

            return db.InvoiceDetail.create(
                {
                    InvoiceID: invoice.InvoiceID,
                    ProductID,
                    Quantity
                },
                { transaction }
            );
        });

        await Promise.all(invoiceDetailPromises);

        // Commit transaction
        await transaction.commit();

        res.status(200).json(invoice);
    } catch (error) {
        // Rollback transaction in case of error
        await transaction.rollback();
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});


module.exports = {
    createInvoice,
    getInvoice,
    getAllInvoice,
    updateInvoice,
};
