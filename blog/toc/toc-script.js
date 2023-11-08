function insertToc() {
  // Create a new XMLHttpRequest or use the Fetch API to load the top-bar.html content
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/blog/toc/toc.html', true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      const tocContent = xhr.responseText;

      // Create a new div element for the top-bar
      const tocContainer = document.querySelector('.toc-container');
      tocContainer.innerHTML = tocContent;
    }
  };

  xhr.send();
}

insertToc();
