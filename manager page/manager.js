fetch(`http://localhost:8080/effort/allEffort`)
.then( response => {
    if (!response.ok){
        throw new Error('Network response was not ok ' + response.statusText)
    }
    return response.json();
})
.then(data => {
    data.forEach(effort => {
        createEffortDiv(effort);
    });
})
.catch()

function createEffortDiv(effort){
    const effortDiv = document.createElement('div');
    effortDiv.classList.add('effort');

    const effortDataList = document.createElement('ul');
    effortDataList.classList.add('effort-data');

    // Create the list items and paragraphs
    const effortList = document.createElement('li');
    effortList.innerHTML = `<p class="employee-id">${effort.employee.empId}</p>`;

    const effortDate = document.createElement('li');
    effortDate.innerHTML = `<p class="employee-details">${effort.startDate} to ${effort.endDate}</p>`;

    const task = document.createElement('li');
    task.innerHTML = `<p class="description">${effort.task}</p>`;

    const hours = document.createElement('li');
    hours.innerHTML = `<p class="description">${effort.hours}</p>`;

    const divButton = document.createElement('div');
    divButton.classList.add('button');

    const approveButton = document.createElement('li');
    approveButton.innerHTML = `<button class="approve">Approve</button>`;
    
    const deleteButton = document.createElement('li');
    deleteButton.innerHTML = `<button class="delete">Delete</button>`;

    divButton.appendChild(approveButton);
    divButton.appendChild(deleteButton);

    effortDataList.appendChild(effortList);
    effortDataList.appendChild(effortDate);
    effortDataList.appendChild(task);
    effortDataList.appendChild(hours);
    effortDataList.appendChild(divButton);
    

    effortDiv.appendChild(effortDataList);

    document.querySelector('.container').appendChild(effortDiv);


}

document.getElementById("performanceCheck").addEventListener("click", function (){

    // Get the selected month from the <select> element
    const empId = document.getElementById('employee-id').value;
  
    
    fetch(`http://localhost:8080/effort/${empId}/myEffort`)
    .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    // .then(data => {
    //     const filteredEfforts = data.filter( effort =>{
    //         const effortMonth = new Date(effort.startDate).toLocaleString('default', {month: 'long'});
    //         return effortMonth === selectedMonth;
    //     }) 
    //     return filteredEfforts;
    // })
    .then(data => {
        console.log(data);
      createChart(data , 'line');//bar , doughnut , line, polarArea, Radar
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
            label: 'for project efforts',
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