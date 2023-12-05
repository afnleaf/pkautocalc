function main() {
    // check if teams are valid
    // return notice to user that teams are not valid
    // get the textarea element by ID
    var textBox1 = document.getElementById("textBoxLeft").value;
    var textBox2 = document.getElementById("textBoxRight").value;
    //
    console.log(textBox1);
    console.log(textBox2);
}

/*
async function requestResults() {
    console.log("getting results");
    fetch('http://localhost:8080/results') // Assuming the server container is named "server"
      //.then(response => response.json())
      .then(response => response.text())
      .then(data => {
        console.log('Data from server:', data);
        // Handle the received data as needed
      })
      .catch(error => {
        console.error('Error during HTTP request:', error);
      });
}
*/

/*
async function requestResults() {
    console.log("getting results");
  
    try {
      const response = await fetch('http://localhost:8080/results'); // Assuming the server container is named "server"
      
      // Check if the response was successful (status code 2xx)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const html = await response.text(); // Use .text() to get the response as text
      console.log('HTML from server:', html);
  
      // Handle the received HTML data as needed
      // For example, you can inject it into a container element
      document.getElementById('results').innerHTML = html;
  
    } catch (error) {
      console.error('Error during HTTP request:', error);
    }
}

const postTeams = document.getElementById("postButton");

postTeams.addEventListener('click')
*/





/*
async function requestResults() {
    const data = {
        "team1" : document.getElementById("textBoxLeft").value,
        "team2" : document.getElementById("textBoxRight").value
    }

    const url = 'http://localhost:8080/calculation';
    
    try {
        const result = await postData(url, data)
        console.log(result);
    } catch (error) {
        console.error('Error during POST request:', error);
    }

    const getData = fetch(url);
    //const postData = fetch(url)

    Promise.all([getData, postData(url, data)])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => {
            console.log(data[0]);
            console.log(data[1]);
        })
        .catch(error = console.error('Error during requests:', error)
    );
}
*/

async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return response;
}

async function requestResults() {
    const data = {
        "team1" : document.getElementById("textBoxLeft").value,
        "team2" : document.getElementById("textBoxRight").value
    }

    const url = 'http://localhost:8080/calculation';
    
    try {
        const result = await postData(url, data);
        //console.log(result);
        const htmlResult = await result.text();
        document.getElementById('results').innerHTML = htmlResult;
    } catch (error) {
        console.error('Error during POST request:', error);
    }
}