function insertToc() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/blog/toc/toc.html', true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      const tocContent = xhr.responseText;

      const tocContainer = document.querySelector('.toc-container');
      tocContainer.innerHTML = tocContent;
    }
  };

  xhr.send();
}

insertToc();
