const productRouter = require('./product_routes');
const categoryRouter = require('./category_routes');
const invoiceRouter = require('./invoice_routes');
const customerRouter = require('./customer_routes');
const employeeRouter = require('./emloyee_routes');
const orderRouter = require('./order_routes');
const userRouter = require('./user_routes');
const voucherRouter = require('./voucher_routes');

const initRoute = (app) => {
    app.use('/api/product', productRouter);
    app.use('/api/category', categoryRouter);
    app.use('/api/invoice', invoiceRouter);
    app.use('/api/customer', customerRouter);
    app.use('/api/employee', employeeRouter);
    app.use('/api/order', orderRouter);
    app.use('/api/user', userRouter);
    app.use('/api/voucher',voucherRouter);
}

module.exports = initRoute;