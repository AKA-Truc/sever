// Function to fetch order details based on order ID
async function fetchOrderDetails(orderId) {
    try {
        const response = await fetch(`http://localhost:8080/api/order/getOrder/${orderId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        return data.orderData; // Adjust based on actual response structure
    } catch (error) {
        console.error('Error fetching order details:', error);
        return null;
    }
}

// Function to fetch categories for product selection
async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:8080/api/category/getAllCategories');
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        return data.listCategory; // Adjust based on actual response structure
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

// Function to populate select options with categories
function populateCategories(categories) {
    const categorySelect = document.getElementById('CategoryID');
    categorySelect.innerHTML = ''; // Clear existing options

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.CategoryID;
        option.textContent = category.Name;
        categorySelect.appendChild(option);
    });
}

// Function to update the form with order details
function updateOrderForm(order) {
    document.getElementById('Name').value = order.Name || '';
    document.getElementById('Phone').value = order.Phone || '';
    document.getElementById('OrderDate').value = order.OrderDate || '';
    document.querySelector(`input[name="Gender"][value="${order.Gender || ''}"]`).checked = true;

    // Populate products dynamically
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear existing products

    order.Products.forEach(product => {
        const productForm = createProductForm(product.ProductName, product.Quantity);
        productList.appendChild(productForm);
    });
}

// Function to create a product form dynamically
function createProductForm(productName = '', quantity = '') {
    const productForm = document.createElement('div');
    productForm.classList.add('product-form');

    productForm.innerHTML = `
        <div class="input">
            <label for="ProductName">Tên sản phẩm</label>
            <input type="text" class="product-name" name="ProductName" value="${productName}" placeholder="Nhập tên sản phẩm" required>
        </div>
        <div class="input">
            <label for="Quantity">Số lượng</label>
            <input type="number" class="quantity" name="Quantity" value="${quantity}" placeholder="Nhập số lượng" required>
        </div>
        <button type="button" class="remove-btn" onclick="removeProduct(this)">Xóa</button>
    `;

    return productForm;
}

// Function to add a product form dynamically
function addProduct() {
    const productList = document.getElementById('product-list');
    const productForm = createProductForm();
    productList.appendChild(productForm);
}

// Function to remove a product form
function removeProduct(button) {
    const productForm = button.closest('.product-form');
    productForm.remove();
}

// Function to gather form data and submit the updated order
async function submitUpdatedOrder(orderId) {
    const formData = new FormData(document.getElementById('employeeform'));

    const updatedOrder = {
        Name: formData.get('Name'),
        Phone: formData.get('Phone'),
        OrderDate: formData.get('OrderDate'),
        Gender: formData.get('Gender'),
        Products: []
    };

    const productForms = document.querySelectorAll('.product-form');
    productForms.forEach(form => {
        const productName = form.querySelector('.product-name').value;
        const quantity = form.querySelector('.quantity').value;

        updatedOrder.Products.push({ ProductName: productName, Quantity: quantity });
    });

    try {
        const response = await fetch(`http://localhost:8080/api/order/updateOrder/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedOrder)
        });

        if (!response.ok) {
            throw new Error('Failed to update order');
        }

        const data = await response.json();
        alert('Order updated successfully!');
        // Redirect or update UI as needed after successful update
        console.log('Updated Order:', data); // Log the updated order data
    } catch (error) {
        console.error('Error updating order:', error);
        alert('Failed to update order');
    }
}

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    console.log("OrderID: ", orderId);

    if (orderId) {
        const order = await fetchOrderDetails(orderId);
        if (order) {
            updateOrderForm(order);
        } else {
            console.error('Failed to fetch order details');
            alert('Failed to fetch order details');
        }
    }

    const categories = await fetchCategories();
    populateCategories(categories);
});

