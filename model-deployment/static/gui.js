const textElement = document.getElementById('animated-text');
const text = textElement.textContent;
const textArray = text.split('');
let currentIndex = 0;

function writeText() {
  if (currentIndex < textArray.length) {
    textElement.textContent = '';
    for (let i = 0; i <= currentIndex; i++) {
      textElement.textContent += textArray[i];
    }
    currentIndex++;
    setTimeout(writeText, 100); // adjust the speed of the animation
  } else {
    setTimeout(function() {
      currentIndex = 0;
      writeText();
    }, 10000); // wait for 10 seconds before rewriting
  }
}

writeText();

// Re-structure the data


// Get all the input fields and the predict button
const inputFields = document.querySelectorAll('input, select');
const predictButton = document.querySelector('.button');

// Add an event listener to the predict button
predictButton.addEventListener('click', (e) => {
  e.preventDefault();
  const formData = {};

  // Remove any existing error messages
  inputFields.forEach((input) => {
    const errorMessage = input.parentNode.querySelector('span');
    if (errorMessage) {
      errorMessage.remove();
    }
  });

  // Loop through all the input fields and check if they are empty
  inputFields.forEach((input) => {
    if (input.type === 'select-one') {
      const selectedOption = input.options[input.selectedIndex];
      if (input.value === '3' || input.value === '') {
        // Display an error message if the select field is not selected
        const errorMessage = document.createElement('span');
        errorMessage.textContent = 'Please select an option';
        errorMessage.style.color = 'red';
        input.parentNode.appendChild(errorMessage);
      } else {
        formData[input.name] = selectedOption.text;
      }
    } else if (input.type === 'checkbox') {
      formData[input.name] = input.checked;
    } else if (input.value === '' && input.name !== 'res') {
      // Display an error message if the input field is empty
      const errorMessage = document.createElement('span');
      errorMessage.textContent = 'Please fill in this field';
      errorMessage.style.color = 'red';
      input.parentNode.appendChild(errorMessage);
    } else {
      formData[input.name] = input.value;
    }
  });

  // If all fields are filled in, send the data to the backend
  if (Object.keys(formData).length === inputFields.length) {
    // Re-structure data
    const newData = {
        'repeated' : formData['repeated'],
        'car parking space' : formData['car_parking_space'],
        'room type' : formData['room'],
        'type of meal' : formData['meal'],
        'market segment' : formData['market'],
        'lead time' : formData['lead_time'],
        'p-c' : formData['p-c'],
        'p-not-c' : formData['p-not-c'],
        'average price' : formData['avg-price'],
        'special requests' : formData['special-requests'],
        'num adults' : formData['num-adults'],
        'num children' : formData['num-children'],
        'num weekend' : formData['weekend-nights'],
        'num week' : formData['week-nights'],
        'date' : formData['date']
    }
    console.log("ooooo");
    // Send the data to the backend using fetch or XMLHttpRequest
    fetch('/predict', {
      
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newData)
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Received data:', data);
      // Display the prediction on the page
      document.getElementById('result-tex').value = `${data.prediction}`
      // Handle the data here
    })
    .catch((error) => console.log('Error:', error));
  }
});