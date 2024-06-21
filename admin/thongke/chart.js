var xValues = ["Hải Mi", "Haime", "Meme", "Mi", "KKkk"];
var yValues = [55, 49, 44, 24, 50];
var barColors = [
  "#b91d47",
  "#00aba9",
  "#2b5797",
  "#e8c3b9",
  "#1e7145"
];

new Chart("myChart", {
  type: "doughnut",
  data: {
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }],
    labels: xValues
  },
//   options: {
//     title: {
//       display: true,
//       text: "World Wide Wine Production 2018"
//     }
//   }
});

const xValues1 = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
const yValues1 = [100, 4000, 300, 3000, 3500, 8000, 600];

new Chart("myChart1", {
    type: "line",
    data: {
      labels: xValues1,
      datasets: [{
        fill: false,
        lineTension: 0,
        backgroundColor: "rgba(0,0,255,1.0)",
        borderColor: "rgba(0,0,255,0.1)",
        data: yValues1
      }]
    },
    options: {
      legend: {display: false},
      scales: {
        yAxes: [{ticks: {min: 100, max:10000}}],
      }
    }
  });
