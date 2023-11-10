function insertToc() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/main/recent-blogs/recent-blogs.html', true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      const recentBlogs = xhr.responseText;

      const blogsContainer = document.querySelector('.recent-blogs');
      blogsContainer.innerHTML = recentBlogs;
    }
  };

  xhr.send();
}

insertToc();
