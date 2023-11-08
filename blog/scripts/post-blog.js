function format_blog_date() {
  var blogDate = document.getElementById("blog-date");

  // Parse the datetime attribute and format it
  var date = new Date(blogDate.getAttribute("datetime"));
  var options = { year: 'numeric', month: 'long', day: 'numeric' };
  var formattedDate = date.toLocaleDateString(undefined, options);

  // Set the formatted date as the inner text of the <time> element
  blogDate.innerText = formattedDate;
}

format_blog_date();
