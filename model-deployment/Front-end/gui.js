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