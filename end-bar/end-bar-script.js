function insertEndBar() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/end-bar/end-bar.html', true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      const endBarContent = xhr.responseText;

      // Create a new div element for the end-bar
      const endBarContainer = document.createElement('div');
      endBarContainer.innerHTML = endBarContent;

      // Find the element where you want to insert the end-bar
      const contentContainer = document.querySelector('.content-container');

      if (contentContainer) {
        contentContainer.appendChild(endBarContainer);

      endBarContainer.querySelector('#copy-email').addEventListener('click', function() {
          var textToCopy = "me@rancic.org";

          // Create a temporary textarea element to hold the text
          var textArea = document.createElement("textarea");
          textArea.value = textToCopy;

          // Append the textarea to the document
          document.body.appendChild(textArea);

          // Select the text in the textarea
          textArea.select();

          // Copy the selected text to the clipboard
          document.execCommand('copy');

          // Remove the textarea from the document
          document.body.removeChild(textArea);
      })
      }
    }
  };

  xhr.send();
}
insertEndBar();

window.onscroll = function() {
  var endBar = document.getElementById('endBar');
  var scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

  // Adjust this value according to how close to the bottom you want the end card to appear
  var triggerOffset = 35;

  // Show the end card when user scrolls to the bottom
  if ((window.innerHeight + scrollPosition) >= (document.body.offsetHeight - triggerOffset)) {
    endBar.style.bottom = '0';
  } else {
    endBar.style.bottom = '-150px'; // Hide the end card if not at the bottom
  }
};

