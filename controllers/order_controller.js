const Order = require('../Models/order');
const Product = require('../Models/product');
const Customer = require('../Models/customer');
const db = require('../Models');
const OrderDetail = require('../Models/orderdetail');
const asyncHandler = require('express-async-handler');

const createOrder = asyncHandler(async (req, res) => {
    const { CustomerID, OrderDate, Status, orderDetails } = req.body;
    
    // Kiểm tra xem tất cả các dữ liệu cần thiết có được cung cấp hay không
    if (!CustomerID || !OrderDate || !Status || !Array.isArray(orderDetails)) {
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
        include: [ {model: db.OrderDetail , as: 'OrderDetail', include: [ {model: db.Product, as: 'Product'}]},{ model: db.Customer, as: 'Customer' }]
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
  const { CustomerID, OrderDate, Status, orderDetails } = req.body;
  const t = await db.sequelize.transaction();

  try {
      const order = await db.Order.findByPk(oid, { transaction: t });
      if (!order) {
          return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
      }

      // Update thông tin đơn hàng
      await order.update({
          CustomerID,
          OrderDate,
          Status
      }, { transaction: t });

      // Xóa các mục trong đơn hàng cũ
      await db.OrderDetail.destroy({
          where: { OrderID: oid },
          transaction: t
      });

      // Tạo các mục trong đơn hàng mới và cập nhật số lượng tồn kho
      const orderDetailPromises = orderDetails.map(async (item) => {
          const { ProductID, Quantity } = item;

          if (!ProductID || !Quantity) {
              throw new Error('Thiếu các trường bắt buộc trong chi tiết đơn hàng');
          }

          // Tìm sản phẩm
          const product = await db.Product.findByPk(ProductID, { transaction: t });

          if (!product) {
              throw new Error(`Không tìm thấy sản phẩm với ID: ${ProductID}`);
          }

          // Kiểm tra tồn kho
          if (product.Inventory < Quantity) {
              throw new Error(`Sản phẩm với ID: ${ProductID} không đủ tồn kho`);
          }

          // Cập nhật số lượng tồn kho
          product.Inventory -= Quantity;
          await product.save({ transaction: t });

          // Tạo OrderDetail mới
          return db.OrderDetail.create({
              OrderID: order.OrderID,
              ProductID,
              Quantity
          }, { transaction: t });
      });

      await Promise.all(orderDetailPromises);

      // Commit transaction
      await t.commit();

      // Lấy thông tin đơn hàng sau khi đã cập nhật
      const updatedOrder = await db.Order.findByPk(oid, {
          include: [
              { model: db.OrderDetail, as: 'OrderDetail', include: [{ model: db.Product, as: 'Product' }] },
              { model: db.Customer, as: 'Customer' }
          ],
          transaction: t
      });

      res.status(200).json(updatedOrder);
  } catch (error) {
      await t.rollback();
      console.error(error);
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
const confirmOrder = asyncHandler(async (req, res) => {
  const { oid } = req.params;

  try {
    const order = await db.Order.findByPk(oid);

    if (!order) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    }

    // Update trạng thái đơn hàng thành 'Đã xác nhận' (Status = 2)
    order.Status = "Đã Xác Nhận";
    await order.save();

    res.status(200).json({ message: 'Xác nhận đơn hàng thành công', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Xác nhận đơn hàng thất bại' });
  }
});
module.exports = {
    createOrder,
    getAllOrder,
    getOrder,
    updateOrder,
    deleteOrder,
    confirmOrder
};
