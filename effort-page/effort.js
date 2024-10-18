function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Get the empId from the URL
const empId = getQueryParam('empId');
//console.log(empId);  // You can now use empId in your JavaScript code

document.getElementById("effort-form").addEventListener('submit', function (event){
    event.preventDefault();
    console.log("submitted");
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const tasks = document.getElementById('effortFor').value;
    const location = document.getElementById('location').value;
    const hours = document.getElementById('hours').value;

    const effort ={
        startDate : from ,
        endDate : to,
        task : tasks,
        location : location,
        hours: parseInt(hours),  // Convert hours to integer
        employee: {              // Send employee as an object
            empId: parseInt(empId)         // Assuming empId is extracted from the query parameters or form input
        }
    }

    fetch(`http://localhost:8080/effort/addEffort`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(effort) 

    })
    .then((response) => {
        console.log(response);
    })
})

document.getElementById("performanceCheck").addEventListener("click", function (){

  // function filterEffortsByMonth(efforts,selectedMonth) {
  //     return efforts.filter(effort => {
  //         const effortMonth = new Date(effort.startDate).toLocaleString('default', { month: 'long' });
  //         return effortMonth === selectedMonth;
  //     });
  // }

  // Get the selected month from the <select> element
  const selectedMonth = document.getElementById('month').value;

  // Filter the efforts
  //const filteredEfforts = filterEffortsByMonth(selectedMonth);

  // Log or display the filtered efforts
  //console.log(filteredEfforts);

  fetch(`http://localhost:8080/effort/${empId}/myEffort`)
  .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
      const filteredEfforts = data.filter( effort =>{
          const effortMonth = new Date(effort.startDate).toLocaleString('default', {month: 'long'});
          return effortMonth === selectedMonth;
      }) 
      return filteredEfforts;
  })
  .then(data =>{
    createChart(data , 'doughnut');//bars , doughnut , line, polarArea, Radar
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
})

function createChart(data , type){
  const ctx = document.getElementById('performanceChart');

    new Chart(ctx, {
      type: type,
      data: {
        //labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        labels: data.map(row => row.task),
        datasets: [{
          label: '# of Votes',
          //data: [12, 19, 3, 5, 2, 3],
          data: data.map(row => row.hours),
          borderWidth: 2
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        maintainAspectRatio: false
      }
    });
}
