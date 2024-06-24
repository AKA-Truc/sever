const totalRevenueValue = document.getElementById('total-revenue-value');
const totalOrdersValue = document.getElementById('total-orders-value');
const totalProductsSoldValue = document.getElementById('total-products-sold-value');
const totalEmployeesValue = document.getElementById('total-employees-value');
const yearSelect = document.getElementById('year-select');

async function fetchTotalRevenue() {
  try {
      console.log('Fetching total revenue...');
      const response = await fetch('http://localhost:8080/api/report/getTotalRevenue',{
        method: "GET",
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch total revenue');
      }
      
      const data = await response.json();
      console.log('Total revenue:', data);
      totalRevenueValue.textContent = data || 0;
  } catch (error) {
      console.error('Error fetching total revenue:', error);
  }
}

async function fetchTotalOrders() {
  try {
      console.log('Fetching total orders...');
      const response = await fetch('http://localhost:8080/api/report/getTotalOrders',{
        method: "GET",
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch total orders');
      }
      
      const data = await response.json();
      console.log('Total orders:', data);
      totalOrdersValue.textContent = data || 0;
  } catch (error) {
      console.error('Error fetching total orders:', error);
  }
}

async function fetchTotalProductsSold() {
  try {
      console.log('Fetching total products sold...');
      const response = await fetch('http://localhost:8080/api/report/getTotalProductsSold',{
        method: "GET",
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch total products sold');
      }
      
      const data = await response.json();
      console.log('Total products sold:', data);
      totalProductsSoldValue.textContent = data || 0;
  } catch (error) {
      console.error('Error fetching total products sold:', error);
  }
}

async function fetchTotalEmployees() {
  try {
      console.log('Fetching total employees...');
      const response = await fetch('http://localhost:8080/api/report/getTotalEmployees',{
        method: "GET",
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch total employees');
      }
      
      const data = await response.json();
      console.log('Total employees:', data);
      totalEmployeesValue.textContent = data || 0;
  } catch (error) {
      console.error('Error fetching total employees:', error);
  }
}

async function fetchMonthlyRevenue(year) {
  try {
      console.log(`Fetching monthly revenue for year ${year}...`);
      const response = await fetch('http://localhost:8080/api/report/getMonthlyRevenueData',{
        method: "GET",
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch monthly revenue data');
      }
      
      const monthlyRevenueData = await response.json();
      console.log('Monthly revenue data:', monthlyRevenueData);

      const chartData = {
          labels: monthlyRevenueData.map(data => data.month),
          datasets: [{
              label: 'Monthly Revenue',
              data: monthlyRevenueData.map(data => data.revenue),
              backgroundColor: 'rgba(50, 120, 122, 1)',
              borderColor: 'rgba(50, 120, 122, 1)',
              borderWidth: 3,
              fill: false
          }]
      };

      new Chart(document.getElementById('monthly-revenue-chart'), {
          type: 'line',
          data: chartData,
          options: {
              responsive: true,
              title: {
                  display: true,
                  text: `Monthly Revenue in ${year}`
              },
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero: true
                      }
                  }]
              }
          }
      });
  } catch (error) {
      console.error('Error fetching monthly revenue:', error);
  }
}

async function fetchTopCustomers() {
  try {
      console.log('Fetching top customers...');
      const response = await fetch('http://localhost:8080/api/report/getTopCustomersByOrders',{
        method: "GET",
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch top customers');
      }
      
      const topCustomersData = await response.json();
      console.log('Top customers data:', topCustomersData);

      const chartData = {
          labels: topCustomersData.map(data => data.customerName),
          datasets: [{
              label: 'Number of Orders',
              data: topCustomersData.map(data => data.orderCount),
              backgroundColor: [
                  'rgba(70, 171, 142, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 205, 86, 1)',
                  'rgba(45, 94, 128, 1)',
                  'rgba(45, 94, 200, 1)',
                  'rgba(45, 94, 18, 1)',
                  'rgba(230, 126, 34, 1)'
              ],
              fill: true
          }]
      };

      new Chart(document.getElementById('top-customers-chart'), {
          type: 'pie',
          data: chartData,
          options: {
              responsive: true,
              title: {
                  display: true,
                  text: 'Top Customers by Number of Orders'
              }
          }
      });
  } catch (error) {
      console.error('Error fetching top customers:', error);
  }
}

yearSelect.addEventListener('change', () => {
    const selectedYear = yearSelect.value;
    fetchMonthlyRevenue(selectedYear);
});

// Gọi các hàm fetch dữ liệu khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    fetchTotalRevenue();
    fetchTotalOrders();
    fetchTotalProductsSold();
    fetchTotalEmployees();
    fetchMonthlyRevenue(yearSelect.value);
    fetchTopCustomers();
});
