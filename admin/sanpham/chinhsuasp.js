async function fetchAndUpdateProductDetails(productId) {
    try {
        const response = await fetch(`http://localhost:8080/api/product/getProduct/${productId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }
        const data = await response.json();

        console.log('Data from API:', data); // Kiểm tra dữ liệu từ API

        if (data.success && data.product) {
            const product = data.product;
            
            document.getElementById('Name').value = product.Name || '';
            document.getElementById('CategoryID').value = product.CategoryID || '';
            document.getElementById('Brand').value = product.Brand || '';
            document.getElementById('Price').value = product.Price || '';
            document.getElementById('Inventory').value = product.Inventory || '';
            document.getElementById('Volume').value = product.Volume || '';
            document.getElementById('Description').value = product.Description || '';
        }
    } catch (error) {
        console.error('Error fetching data from API:', error);
        alert('Failed to fetch product details');
    }
}

// Function to handle product form submission
async function handleProductFormSubmit(event) {
    event.preventDefault();

    const productId = new URLSearchParams(window.location.search).get('id');
    const updatedProduct = {
        Name: document.getElementById('Name').value,
        CategoryID: document.getElementById('CategoryID').value,
        Brand: document.getElementById('Brand').value,
        Price: document.getElementById('Price').value,
        Inventory: document.getElementById('Inventory').value,
        Volume: document.getElementById('Volume').value,
        Description: document.getElementById('Description').value
    };

    try {
        const response = await fetch(`http://localhost:8080/api/product/updateProduct/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        alert('Product updated successfully!');
        window.location.href = '../sanpham/sp.html'; // Thay đổi thành URL chuyển hướng của bạn
    } catch (error) {
        console.error('Error updating product:', error);
        alert('Failed to update product');
    }
}

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    console.log("ProductID: ", productId);
    if (productId) {
        await fetchAndUpdateProductDetails(productId);
    }

    document.getElementById('myForm').addEventListener('submit', handleProductFormSubmit);
});
