const db = require('../Models');
const Product = require('../Models/product');
const Category = require('../Models/category');
const asyncHandler = require('express-async-handler');

const createCategory = asyncHandler(async (req, res) => {
    const { Name } = req.body;

    try {
        if (!Name) {
            return res.status(400).json({
                success: false,
                message: "Tên danh mục sản phẩm không được để trống"
            });
        }

        // Kiểm tra xem danh mục đã tồn tại hay chưa
        const categoryExist = await db.Category.findOne({ where: { Name }, attributes: ['CategoryID', 'Name'] });

        if (categoryExist) {
            return res.status(400).json({
                success: false,
                message: "Danh mục sản phẩm đã tồn tại"
            });
        }

        // Tạo mới danh mục sản phẩm
        const newCategory = await db.Category.create({ Name });

        return res.status(201).json({
            success: true,
            newCategory
        });
    } catch (error) {
        console.error("Error in createCategory:", error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi khi tạo danh mục sản phẩm"
        });
    }
});

const getCategory = asyncHandler(async (req, res) => {
    const { ctid } = req.params;

    const category = await db.Category.findByPk(ctid);

    if (category) {
        return res.status(200).json({
            success: true,
            category: category
        });
    } else {
        return res.status(404).json({
            success: false,
            message: "Danh mục không tồn tại"
        });
    }
});

const updateCategory = asyncHandler(async (req, res) => {
    const { ctid } = req.params;

    const category = await db.Category.findByPk(ctid);

    if (!category) {
        return res.status(404).json({
            success: false,
            message: "Danh mục không tồn tại"
        });
    }

    await db.category.update(req.body);

    return res.status(200).json({
        success: true,
        updatedCategory: category
    });
});

const deleteCategory = asyncHandler(async (req, res) => {
    const { ctid } = req.params;

    try {
        const category = await db.Category.findByPk(ctid);

        // Kiểm tra xem danh mục có tồn tại hay không
        if (!category) {
            return res.status(404).json({ 
                success: false, 
                message: "Danh mục không tồn tại" 
            });
        }

        // Kiểm tra xem danh mục có sản phẩm nào không
        const productsInCategory = await db.Product.findAll({ where: { CategoryID: ctid } });
        
        if (productsInCategory.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Không thể xóa danh mục này vì có sản phẩm trong danh mục" 
            });
        }

        // Xóa danh mục
        await db.Category.destroy({ where: { CategoryID: ctid } });

        return res.status(200).json({
            success: true,
            message: `Đã xoá danh mục ${category.Name}`
        });
    } catch (error) {
        console.error("Error in deleteCategory:", error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi khi xóa danh mục"
        });
    }
});


const getAllCategory = asyncHandler(async (req, res) => {
    // Lấy all loại hàng
    const listCategory = await db.Category.findAll();

    for (let category of listCategory) {
        const productCount = await db.Product.count({ where: { categoryId: category.CategoryID } }); // Correct this line
        category.productCount = productCount;
    }

    // Trả về danh sách loại hàng và số lượng sản phẩm cho mỗi loại hàng
    return res.status(200).json({
        success: true,
        listCategory: listCategory
    });
});
module.exports = {
    createCategory,
    getAllCategory,
    getCategory,
    updateCategory,
    deleteCategory
};
