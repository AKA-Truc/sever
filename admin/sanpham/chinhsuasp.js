async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:8080/api/category/getAllcategory'); // Adjust the URL to your actual endpoint
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        const data = await response.json();

        // Log the raw response to see its structure
        console.log('Raw categories response:', data);

        // Extract categories from the response structure
        return data.listCategory || [];
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

async function fetchAndUpdateProductDetails(productId) {
    try {
        const [categories, productResponse] = await Promise.all([
            fetchCategories(),
            fetch(`http://localhost:8080/api/product/getProduct/${productId}`)
        ]);

        if (!productResponse.ok) {
            throw new Error('Failed to fetch product details');
        }
        const productData = await productResponse.json();

        console.log('Categories from API:', categories);
        console.log('Product data from API:', productData);

        // Populate the CategoryID select element with categories
        const categorySelect = document.getElementById('CategoryID');
        categorySelect.innerHTML = ''; // Clear any existing options

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.CategoryID;
            option.textContent = category.Name;
            categorySelect.appendChild(option);
        });

        if (productData && productData.success && productData.productData) {
            const product = productData.productData;

            document.getElementById('Name').value = product.Name || '';
            console.log('Name:', document.getElementById('Name').value);

            document.getElementById('CategoryID').value = product.CategoryID || '';
            console.log('CategoryID:', document.getElementById('CategoryID').value);

            document.getElementById('Brand').value = product.Brand || '';
            console.log('Brand:', document.getElementById('Brand').value);

            document.getElementById('Price').value = product.Price || '';
            console.log('Price:', document.getElementById('Price').value);

            document.getElementById('Inventory').value = product.Inventory || '';
            console.log('Inventory:', document.getElementById('Inventory').value);

            document.getElementById('Volume').value = product.Volume || '';
            console.log('Volume:', document.getElementById('Volume').value);

            document.getElementById('Description').value = product.Description || '';
            console.log('Description:', document.getElementById('Description').value);
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
