async function fetchAndUpdateEmployeeDetails(employeeId) {
    try {
        const response = await fetch(`http://localhost:8080/api/employee/getEmployee/${employeeId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch employee details');
        }
        const data = await response.json();

        console.log('Data from API:', data); // Kiểm tra dữ liệu từ API

        if (data.success && data.Employee) {
            const employee = data.Employee;

            document.getElementById('Name').value = employee.Name || '';
            console.log('Assigned value to Name:', employee.Name || '');

            document.getElementById('Phone').value = employee.Phone || '';
            console.log('Assigned value to Phone:', employee.Phone || '');

            document.getElementById('Address').value = employee.Address || '';
            console.log('Assigned value to Address:', employee.Address || '');

            document.getElementById('Salary').value = employee.Salary || '';
            console.log('Assigned value to Salary:', employee.Salary || '');

            document.getElementById('Role').value = employee.Role || '';
            console.log('Assigned value to Role:', employee.Role || '');

            if (employee.Gender === 'Nam') {
                document.getElementById('GenderMale').checked = true;
            } else if (employee.Gender === 'Nữ') {
                document.getElementById('GenderFemale').checked = true;
            }
            console.log('Assigned value to Gender:', employee.Gender || '');
        }
    } catch (error) {
        console.error('Error fetching data from API:', error);
        alert('Failed to fetch employee details');
    }
}

async function handleEmployeeFormSubmit(event) {
    event.preventDefault();

    const employeeId = new URLSearchParams(window.location.search).get('id');
    const updatedEmployee = {
        Name: document.getElementById('Name').value,
        Phone: document.getElementById('Phone').value,
        Address: document.getElementById('Address').value,
        Salary: document.getElementById('Salary').value,
        Role: document.getElementById('Role').value,
        Gender: document.querySelector('input[name="Gender"]:checked').value
    };

    try {
        const response = await fetch(`http://localhost:8080/api/employee/updateEmployee/${employeeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedEmployee)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        alert('Employee updated successfully!');
        window.location.href = '../quanly/QLNS.html'; // Thay đổi URL chuyển hướng của bạn
    } catch (error) {
        console.error('Error updating employee:', error);
        alert('Failed to update employee');
    }
}

// Sự kiện lắng nghe khi DOM được tải
document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const employeeId = urlParams.get('id');

    if (employeeId) {
        await fetchAndUpdateEmployeeDetails(employeeId);
    }

    document.getElementById('employeeform').addEventListener('submit', handleEmployeeFormSubmit);
});
