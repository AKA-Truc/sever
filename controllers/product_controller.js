const { Op } = require('sequelize');
const db = require('../Models');
const Product = require('../Models/product');
const Category = require('../Models/category');
const asyncHandler = require('express-async-handler');

const createProduct = asyncHandler(async (req, res) => {
    const { CategoryID, Name, Brand, Description, Volume, Price, image, Inventory } = req.body;

    // Kiểm tra xem các trường bắt buộc có đầy đủ không
    if (!CategoryID || !Name || !Brand || !Description || !Volume || !Price || !Inventory) {
        return res.status(400).json({
            success: false,
            mes: "Vui lòng nhập đầy đủ thông tin"
        });
    }

    try {
        // Tạo sản phẩm mới
        const newProduct = await db.Product.create({
            CategoryID,
            Name,
            Brand,
            Description,
            Volume,
            Price,
            image,
            Inventory
        });

        // Trả về phản hồi thành công với sản phẩm vừa tạo
        return res.status(201).json({
            success: true,
            mes: 'Thêm sản phẩm thành công',
            createdProduct: newProduct
        });
    } catch (error) {
        // Trả về phản hồi lỗi nếu có lỗi xảy ra
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    try {
        // Tìm sản phẩm theo ID và bao gồm danh mục
        const product = await db.Product.findOne({
            where: { ProductID: pid },
            include: [{ model: db.Category, as: 'Category' }] // Sử dụng alias 'category'
        });
        if (product) {
            res.status(200).json({
                success: true,
                productData: product
            });
        } else {
            res.status(404).json({
                success: false,
                productData: "Không tìm thấy sản phẩm này"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    try {
        const [updated] = await db.Product.update(req.body, {
            where: { ProductID: pid }
        });
        if (updated) {
            const updatedProduct = await db.Product.findByPk(pid);
            res.status(200).json({
                success: true,
                updatedProduct: updatedProduct
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm hoặc không có gì được cập nhật"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    try {
        const deleted = await db.Product.destroy({
            where: { ProductID: pid }
        });
        if (deleted) {
            res.status(200).json({
                success: true,
                message: "Sản phẩm đã được xoá"
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm hoặc không có gì được xoá"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const getAllProduct = asyncHandler(async (req, res) => {
    try {
        // Tìm sản phẩm theo ID và bao gồm danh mục
        const product = await db.Product.findAll({
            include: [{ model: db.Category, as: 'Category' }] // Sử dụng alias 'category'
        });
        if (product) {
            res.status(200).json({
                success: true,
                productData: product
            });
        } else {
            res.status(404).json({
                success: false,
                productData: "Không tìm thấy sản phẩm này"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


const uploadImageProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;

    try {
        if (!req.files || req.files.length === 0) {
            throw new Error("Không có ảnh được tải lên");
        }

        const product = await db.Product.findByPk(pid);

        if (!product) {
            throw new Error("Không tìm thấy sản phẩm");
        }

        const imagePaths = req.files.map(el => el.path);

        await db.product.update({
            Image: [...product.Image, ...imagePaths]
        });

        return res.status(200).json({
            success: true,
            message: "Ảnh đã được tải lên thành công",
            product
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = {
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    getAllProduct,
    uploadImageProduct
};
