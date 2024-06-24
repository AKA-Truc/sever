// Lắng nghe sự kiện submit của form
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của form
    

    const formData = new FormData(this); // Lấy dữ liệu từ form hiện tại
    console.log(formData);
    try {
        const response = await fetch('http://localhost:8080/api/user/login', {
            method: 'POST',
            body: formData,
            mode: 'cors',
        });

        const data = await response.json();
        console.log(data); // In ra dữ liệu phản hồi từ server để kiểm tra

        if (!response.ok) {
            throw new Error(data.message || 'Đăng nhập không thành công');
        }

        // Lưu vào sessionStorage
        sessionStorage.setItem('accessToken', data.accessToken);

        // Kiểm tra trong sessionStorage
        const accessToken = sessionStorage.getItem('accessToken');

        // Chuyển hướng người dùng đến trang menu.html
        window.location.href = '/admin/menu/menu.html';
    } catch (error) {
        console.error('Đăng nhập không thành công:', error.message);
    }
});
