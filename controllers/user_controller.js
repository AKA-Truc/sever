const db = require('../Models');
const User = require('../Models/user');
const Order = require('../Models/order')
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { generateAccessToken, generateRefreshToken } = require('../middleware/jwt');

const addUserByAdmin = asyncHandler(async (req, res) => {
    const { Name, Phone, Password, Role } = req.body;

    if (!Name || !Phone || !Password || !Role) {
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
    
    const newUser = await db.User.create({
        Name,
        Phone,
        Password,
        Role
    });

    return res.status(200).json({
        success: true,
        mes: 'Thêm tài khoản thành công',
        user: newUser
    });
});

const login = asyncHandler(async (req, res) => {
    const { Phone, Password } = req.body;

    if (!Phone || !Password) {
        return res.status(400).json({
            success: false,
            mes: "Vui lòng nhập đầy đủ thông tin"
        });
    }

    const user = await db.User.findOne({ where: { Phone: Phone } });

    if (user && await user.isCorrectPassword(Password)) {
        const { Password, Role, ...userData } = user.toJSON();

        // Create access token
        const accessToken = generateAccessToken(user.id, Role);
        // Create refresh token
        const newRefreshToken = generateRefreshToken(user.id);
        
        // Save refresh token in db
        await user.update({ refreshToken: newRefreshToken });

        // Save refresh token in cookie
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        // Save access token in cookie
        res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 30 * 60 * 1000 }); // 30 phút

        return res.status(200).json({
            success: true,
            accessToken,
            userData
        });
    } else {
        return res.status(401).json({
            success: false,
            mes: "Thông tin đăng nhập không chính xác"
        });
    }
});

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;

    if (!cookie || !cookie.refreshToken) {
        return res.status(500).json({
            success: false,
            mes: "Không có refresh token trong cookies"
        });
    }

    await db.User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { $unset: { refreshToken: "" } });

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    });

    return res.status(200).json({
        success: true,
        mes: 'Đăng xuất thành công'
    });
});


const getUsers = asyncHandler(async (req, res) => {
    const { uid } = req.params;

    if (!uid) {
        throw new Error("Đã có lỗi xảy ra, vui lòng thử lại");
    }

    const user = await db.User.findByPk(uid, {
        attributes: { exclude: ['Password', 'refreshToken'] }
    });

    if (!user) {
        return res.status(404).json({
            success: false,
            mes: "Người dùng không được tìm thấy"
        });
    }

    return res.status(200).json({
        success: true,
        user: user
    });
});

//lấy tất cả người dùng
const getAlluser= asyncHandler(async (req, res) => {
    const response = await db.User.findAll({
        attributes: { exclude: ['Password', 'Role'] } // Loại bỏ trường 'Password'
    });

    return res.status(200).json({
        success: response.length > 0,
        users: response
    });
});

const deleteUser = asyncHandler(async (req, res) => {
    const { uid } = req.params;

    if (!uid) {
        return res.status(400).json({
            success: false,
            message: "Thiếu thông tin người dùng cần xoá"
        });
    }

    try {
        // Kiểm tra người dùng có tồn tại không
        const user = await db.User.findByPk(uid);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Người dùng không tồn tại"
            });
        }

        // Xoá người dùng
        await db.User.destroy({
            where: { id: uid }
        });

        return res.status(200).json({
            success: true,
            message: `Người dùng với ID ${uid} đã được xoá`
        });
    } catch (error) {
        // Xử lý lỗi
        console.error("Lỗi khi xoá người dùng:", error.message);
        return res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra, vui lòng thử lại"
        });
    }
});

const updateUser = asyncHandler(async (req, res) => {
    const { uid } = req.params;

    if (!uid) {
        return res.status(400).json({
            success: false,
            message: "Thiếu thông tin người dùng cần cập nhật"
        });
    }

    try {
        const [updatedRowsCount, updatedUsers] = await db.User.update(req.body, {
            where: { id: uid },
            returning: true // Trả về các bản ghi đã được cập nhật
        });

        if (updatedRowsCount === 0 || !updatedUsers || updatedUsers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Người dùng không được tìm thấy hoặc không thể cập nhật"
            });
        }

        const updatedUser = updatedUsers[0].toJSON(); // Chuyển đổi thành đối tượng JSON

        // Loại bỏ các trường nhạy cảm từ phản hồi
        delete updatedUser.Password;
        delete updatedUser.refreshToken;

        return res.status(200).json({
            success: true,
            message: "Cập nhật thành công",
            user: updatedUser
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật người dùng:", error.message);
        return res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra, vui lòng thử lại"
        });
    }
});



module.exports = {
    addUserByAdmin,
    login,
    logout,
    getAlluser,
    getUsers,
    deleteUser,
    updateUser,
}