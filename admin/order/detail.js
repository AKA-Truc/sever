const fetchOrderDetailsAndUpdateHTML = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');

    try {
        const response = await fetch(`http://localhost:8080/api/order/getOrder/${orderId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch order details');
        }
        const order = await response.json();

        // Log the order object to check its structure
        console.log(order);

        // Update HTML elements with order details
        if (order.Customer) {
            document.getElementById('customerName').innerText = order.Customer.Name || 'N/A';
            document.getElementById('customerPhone').innerText = order.Customer.Phone || 'N/A';
        }
        document.getElementById('orderID').innerText = order.OrderID || 'N/A';
        document.getElementById('orderDate').innerText = order.OrderDate ? new Date(order.OrderDate).toLocaleString() : 'N/A';
        document.getElementById('orderStatus').innerText = order.Status || 'N/A';

        // Example: Updating a product table (adjust based on your actual table structure)
        const productTableBody = document.getElementById('product-table-body');
        productTableBody.innerHTML = ''; // Clear existing content

        if (order.OrderDetail && Array.isArray(order.OrderDetail)) {
            order.OrderDetail.forEach(detail => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${detail.Product?.Name || 'N/A'}</td>
                    <td>${detail.Product?.Price || 'N/A'}</td>
                    <td>${detail.Quantity || 'N/A'}</td>
                `;
                productTableBody.appendChild(row);
            });
        }

    } catch (error) {
        console.error('Error fetching or updating order details:', error);
        alert('Failed to fetch or update order details');
    }
};

const fetchVouchersAndUpdateSelect = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/voucher/getAllVouchers'); // Adjust URL if needed
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
  
        // Kiểm tra dữ liệu trả về
        console.log(data);
  
        // Đảm bảo rằng listVoucher là một mảng
        if (!Array.isArray(data.listVoucher)) {
            throw new Error('Expected an array');
        }
  
        const select = document.getElementById('VoucherID');
        data.listVoucher.forEach(item => {
            const option = document.createElement('option');
            option.value = item.VoucherID; // Adjust field based on actual data
            option.textContent = `${item.Name} - ${item.Describes}`; // Adjust field based on actual data
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching vouchers:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    fetchOrderDetailsAndUpdateHTML();
    fetchVouchersAndUpdateSelect();

    document.getElementById('confirm-btn').addEventListener('click', () => {
        const orderId = document.getElementById('orderID').innerText;
        const voucherId = document.getElementById('VoucherID').value;

        // Construct the new URL
        const newUrl = `../order/bill.html?orderId=${orderId}&voucherId=${voucherId}`;

        // Redirect to the new page
        window.location.href = newUrl;
    });
    document.getElementById('back-btn').addEventListener('click', () => {
        // Construct the new URL
        const newUrl = `../menu/menu.html`;

        // Redirect to the new page
        window.location.href = newUrl;
    });
});
