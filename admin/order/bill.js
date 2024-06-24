'use strict';

const fetchOrderDetailsAndUpdateHTML = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    const voucherId = urlParams.get('voucherId');

    // Log các giá trị trích xuất (cho mục đích gỡ lỗi)
    console.log('ID Đơn hàng:', orderId);
    console.log('ID Mã giảm giá:', voucherId);

    try {
        // Lấy chi tiết đơn hàng từ API
        const orderResponse = await fetch(`http://localhost:8080/api/order/getOrder/${orderId}`);
        if (!orderResponse.ok) {
            throw new Error('Không thể lấy chi tiết đơn hàng');
        }
        const order = await orderResponse.json();

        // Log đối tượng đơn hàng để kiểm tra cấu trúc
        console.log('Chi tiết đơn hàng:', order);

        // Cập nhật các phần tử HTML với chi tiết đơn hàng
        if (order.Customer) {
            document.getElementById('customerName').innerText = order.Customer.Name || 'Chưa cập nhật';
            document.getElementById('customerPhone').innerText = order.Customer.Phone || 'Chưa cập nhật';
        }
        document.getElementById('orderID').innerText = order.OrderID || 'Chưa cập nhật';
        document.getElementById('orderDate').innerText = order.OrderDate ? new Date(order.OrderDate).toLocaleString() : 'Chưa cập nhật';
        document.getElementById('orderStatus').innerText = order.Status || 'Chưa cập nhật';

        // Cập nhật bảng sản phẩm với chi tiết đơn hàng
        const productTableBody = document.getElementById('product-table-body');
        productTableBody.innerHTML = ''; // Xóa nội dung hiện tại
        let totalAmount = 0;

        if (order.OrderDetail && Array.isArray(order.OrderDetail)) {
            order.OrderDetail.forEach(detail => {
                const productTotal = detail.Quantity * detail.Product.Price;
                totalAmount += productTotal;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${detail.Product?.Name || 'Chưa cập nhật'}</td>
                    <td>${detail.Product?.Price.toLocaleString() || 'Chưa cập nhật'}</td>
                    <td>${detail.Quantity || 'Chưa cập nhật'}</td>
                    <td>${productTotal.toLocaleString() || 'Chưa cập nhật'}</td>
                `;
                productTableBody.appendChild(row);
            });
        }

        // Cập nhật tổng cộng
        document.getElementById('totalAmount').innerText = totalAmount.toLocaleString();

        // Lấy và áp dụng giảm giá từ mã giảm giá nếu có voucherId
        if (voucherId != "None") {
            const voucherResponse = await fetch(`http://localhost:8080/api/voucher/getVoucher/${voucherId}`);
            if (!voucherResponse.ok) {
                throw new Error('Không thể lấy chi tiết mã giảm giá');
            }
            const voucher = await voucherResponse.json();
            console.log('Chi tiết mã giảm giá:', voucher);

            // Xử lý dữ liệu giảm giá
            const discountPercent = voucher.voucher.Percent !== undefined ? voucher.voucher.Percent : 0;
            const discountAmount = (discountPercent / 100) * totalAmount;
            if (discountAmount > voucher.voucher.Maxcost) {
                const index = voucher.voucher.Maxcost;
                document.getElementById('discountAmount').innerText = index.toLocaleString();
                const totalPaymentAmount = totalAmount - index;
                document.getElementById('totalPaymentAmount').innerText = totalPaymentAmount.toLocaleString();
            } else {
                document.getElementById('discountAmount').innerText = discountAmount.toLocaleString();

                // Tính toán và cập nhật tổng tiền thanh toán
                const totalPaymentAmount = totalAmount - discountAmount;
                document.getElementById('totalPaymentAmount').innerText = totalPaymentAmount.toLocaleString();
            }
            // Hiển thị tên mã giảm giá đã áp dụng
            document.getElementById('voucherName').innerText = (voucher.voucher.Name + " - " + voucher.voucher.Describes + " - Giảm tối đa " + voucher.voucher.Maxcost);
        } else {
            // Xử lý trường hợp không có voucherId
            document.getElementById('voucherName').innerText = "Không Sử Dụng ";
            document.getElementById('discountAmount').innerText = '0';
            document.getElementById('totalPaymentAmount').innerText = totalAmount.toLocaleString();
        }
    } catch (error) {
        console.error('Lỗi khi lấy hoặc cập nhật chi tiết đơn hàng:', error);
        alert('Không thể lấy hoặc cập nhật chi tiết đơn hàng');
    }
};

// Gọi hàm fetchOrderDetailsAndUpdateHTML khi trang được tải
document.addEventListener('DOMContentLoaded', fetchOrderDetailsAndUpdateHTML);

// Xử lý sự kiện khi người dùng nhấn vào nút Xác Nhận Đơn Hàng
document.getElementById('confirmButton').addEventListener('click', async function () {
    try {
        // Thực hiện các hành động xác nhận đơn hàng, ví dụ như gửi yêu cầu lưu đơn hàng hoặc thông báo xác nhận
        alert('Đơn hàng đã được xác nhận!');

        // Chuyển hướng người dùng về trang chủ hoặc trang khác
        window.location.href = '../menu/menu.html'; // Thay đổi đường dẫn theo trang bạn muốn chuyển hướng đến
    } catch (error) {
        console.error('Lỗi khi xác nhận đơn hàng:', error);
        alert('Đã xảy ra lỗi khi xác nhận đơn hàng');
    }
});
