function insertTopBar() {
  // Create a new XMLHttpRequest or use the Fetch API to load the top-bar.html content
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/top-bar/top-bar.html', true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      const topBarContent = xhr.responseText;

      // Create a new div element for the top-bar
      const topBarContainer = document.createElement('div');
      topBarContainer.innerHTML = topBarContent;

      // Find the element where you want to insert the top-bar
      const contentContainer = document.querySelector('.content-container');

      if (contentContainer) {
        contentContainer.appendChild(topBarContainer);
      }
    }
  };

  xhr.send();
}

insertTopBar();
