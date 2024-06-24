document.addEventListener('DOMContentLoaded', () => {
    console.log('Document is ready.');

    const fetchAndDisplayOrders = () => {
        fetch('http://localhost:8080/api/order/getAllOrder')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Data fetched:', data);

                const orders = data;

                if (!Array.isArray(orders)) {
                    throw new Error('Expected an array of orders');
                }

                const orderList = document.getElementById('order-List');
                orderList.innerHTML = ''; // Clear previous rows

                orders.forEach((order, index) => {
                    if (order.Status === "Chưa Xác Nhận") {
                        const row = document.createElement('tr');

                        row.innerHTML = `
                            <td class="editable">${index + 1}</td>
                            <td class="editable">${order.OrderID}</td>
                            <td class="editable">${order.Customer.Name}</td>
                            <td class="editable">${order.OrderDate}</td>
                            <td class="editable">${order.Status}</td>
                            <td class="action-buttons">
                                <button class="edit-btn"><ion-icon name="create-outline"></ion-icon></button>
                                <button class="confirm-btn" data-id="${order.OrderID}"><ion-icon name="checkbox-outline"></ion-icon></button>
                            </td>
                        `;

                        orderList.appendChild(row);

                        // Add click event listener to edit button
                        const editBtn = row.querySelector('.edit-btn');
                        editBtn.addEventListener('click', () => {
                            // Redirect to another page with order ID
                            window.location.href = `../order/detail.html?id=${order.OrderID}`;
                        });
                    }
                });

                // Add event listeners for confirm buttons
                const popup = document.getElementById('popup');
                const confirmBtns = document.querySelectorAll('.confirm-btn');
                let currentRow;
                let orderIdToConfirm;

                confirmBtns.forEach(button => {
                    button.addEventListener('click', function () {
                        popup.style.display = 'flex';
                        currentRow = this.closest('tr');
                        orderIdToConfirm = this.getAttribute('data-id');
                    });
                });

                // Event listener for OK button in the popup
                const popupOk = document.getElementById('popupOk');
                if (popupOk) {
                    popupOk.addEventListener('click', () => {
                        if (orderIdToConfirm) {
                            fetch(`http://localhost:8080/api/order/confirmOrder/${orderIdToConfirm}`, {
                                method: 'PUT'
                            })
                            .then(response => {
                                if (response.ok) {
                                    currentRow.querySelector('.editable:nth-child(5)').textContent = 'Đã xác nhận';
                                    alert('Order confirmed successfully');
                                } else {
                                    alert('Failed to confirm order');
                                }
                                popup.style.display = 'none';
                            })
                            .catch(error => {
                                console.error('Error confirming order:', error);
                                popup.style.display = 'none';
                            });
                        }
                    });
                } else {
                    console.error('OK button not found in popup');
                }
            })
            .catch(error => console.error('Error fetching orders:', error));
    };

    // Initial fetch and display
    fetchAndDisplayOrders();
});
