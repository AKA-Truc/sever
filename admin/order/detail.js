const fetchOrderDetailsAndUpdateHTML = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');

    try {
        const response = await fetch(`http://localhost:8080/api/order/getOrder/${orderId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch order details');
        }
        const order = await response.json();

        // Update HTML elements with order details
        document.getElementById('customerName').innerText = order.Customer.Name;
        document.getElementById('customerPhone').innerText = order.Customer.Phone;
        document.getElementById('orderID').innerText = order.OrderID;
        document.getElementById('orderDate').innerText = new Date(order.OrderDate).toLocaleString();
        document.getElementById('orderStatus').innerText = order.Status;

        // Example: Updating a product table (adjust based on your actual table structure)
        const productTableBody = document.getElementById('product-table-body');
        productTableBody.innerHTML = ''; // Clear existing content

        order.OrderDetail.forEach(detail => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${detail.Product.Name}</td>
                <td>${detail.Product.Price}</td>
                <td>${detail.Quantity}</td>
                <td>${detail.Quantity * detail.Product.Price}</td>
            `;
            productTableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Error fetching or updating order details:', error);
        alert('Failed to fetch or update order details');
    }
};

document.addEventListener('DOMContentLoaded', fetchOrderDetailsAndUpdateHTML);
