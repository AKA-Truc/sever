const Order = require('../Models/order');
const Product = require('../Models/product');
const Customer = require('../Models/customer');
const db = require('../Models');
const OrderDetail = require('../Models/orderdetail');
const asyncHandler = require('express-async-handler');

const createOrder = asyncHandler(async (req, res) => {
    const { CustomerID, OrderDate, Status, orderDetails } = req.body;
  
    // Kiểm tra xem tất cả các dữ liệu cần thiết có được cung cấp hay không
    if (!CustomerID || !OrderDate || !orderDetails || !Array.isArray(orderDetails)) {
      return res.status(400).json({ error: 'Thiếu các trường bắt buộc' });
    }
  
    const transaction = await db.sequelize.transaction();
  
    try {
      // Tạo đơn hàng
      const newOrder = await db.Order.create(
        {
          CustomerID,
          OrderDate,
          Status
        },
        { transaction }
      );
  
      // Tạo các chi tiết đơn hàng
      const orderDetailPromises = orderDetails.map(async (detail) => {
        const { ProductID, Quantity } = detail;
  
        if (!ProductID || !Quantity) {
          throw new Error('Thiếu các trường bắt buộc trong chi tiết đơn hàng');
        }
  
        // Tìm sản phẩm
        const product = await db.Product.findByPk(ProductID, { transaction });
  
        if (!product) {
          throw new Error(`Không tìm thấy sản phẩm với ID: ${ProductID}`);
        }
  
        // Kiểm tra tồn kho
        if (product.Inventory < Quantity) {
          throw new Error(`Sản phẩm với ID: ${ProductID} không đủ tồn kho`);
        }
  
        // Cập nhật tồn kho
        product.Inventory -= Quantity;
        await product.save({ transaction });
  
        return db.OrderDetail.create(
          {
            OrderID: newOrder.OrderID,
            ProductID,
            Quantity
          },
          { transaction }
        );
      });
      
      await Promise.all(orderDetailPromises);
      
      // Commit giao dịch
      await transaction.commit();
  
      res.status(201).json(newOrder);
    } catch (error) {
      // Rollback giao dịch trong trường hợp lỗi
      await transaction.rollback();
      // Cập nhật số lượng tồn kho
      
      console.error(error);
      res.status(500).json({ error: 'Tạo đơn hàng thất bại' });
    }
});

const getAllOrder = asyncHandler(async (req, res) => {
  try {
    const orders = await db.Order.findAll({
      include: [
        { 
          model: db.OrderDetail,
          as: 'OrderDetail', // Sử dụng alias 'OrderDetail' cho mô hình OrderDetail
          include: [
            { model: db.Product, as: 'Product' } // Sử dụng alias 'Product' cho mô hình Product
          ]
        },
        { model: db.Customer, as: 'Customer' }
      ]
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getOrder = asyncHandler(async (req, res) => {
    const { oid } = req.params;
    try {
      const order = await db.Order.findByPk(oid, {
        include: [ {model: db.OrderDetail , as: 'OrderDetail'},{ model: db.Customer, as: 'Customer' }]
      });
      if (!order) {
        return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
      }
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

const updateOrder = asyncHandler(async (req, res) => {
    const { oid } = req.params;
    const { orderData, orderDetailData } = req.body;
    const t = await db.sequelize.transaction();
  
    try {
      const order = await db.Order.findByPk(oid, { transaction: t });
      if (!order) {
        return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
      }
  
      await db.order.update(orderData, { transaction: t });
  
      // Xóa các mục trong đơn hàng cũ
      await db.OrderItem.destroy({
        where: { OrderID: id },
        transaction: t
      });
  
      // Tạo các mục trong đơn hàng mới và cập nhật số lượng tồn kho
      for (const item of orderDetailData) {
        const product = await db.Product.findByPk(item.ProductID, { transaction: t });
        if (!product) {
          throw new Error(`Không tìm thấy sản phẩm`);
        }
        if (product.Quantity < item.Quantity) {
          throw new Error(`Sản phẩm không đủ số lượng`);
        }
  
        // Tạo OrderItem
        await db.OrderItem.create({
          OrderID: order.OrderID,
          ProductID: item.ProductID,
          Quantity: item.Quantity,
        }, { transaction: t });
  
        // Cập nhật số lượng tồn kho
        product.Quantity -= item.Quantity;
        await db.product.save({ transaction: t });
      }
  
      await t.commit();
      res.status(200).json(order);
    } catch (error) {
      await t.rollback();
      res.status(400).json({ error: error.message });
    }
});

const deleteOrder = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const t = await db.sequelize.transaction();

  try {
      const order = await db.Order.findByPk(oid, { transaction: t });
      if (!order) {
          return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
      }

      // Xóa các mục trong đơn hàng
      await db.OrderDetail.destroy({
          where: { OrderID: oid },
          transaction: t
      });

      // Xóa đơn hàng
      await db.Order.destroy({
          where: { OrderID: oid },
          transaction: t
      });

      await t.commit();
      res.status(200).json({ message: 'Xóa đơn hàng thành công' });
  } catch (error) {
      await t.rollback();
      res.status(500).json({ error: error.message });
  }
});
module.exports = {
    createOrder,
    getAllOrder,
    getOrder,
    updateOrder,
    deleteOrder
};
