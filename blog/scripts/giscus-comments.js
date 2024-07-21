(function() {
  var giscusScript = document.createElement('script');
  giscusScript.src = "https://giscus.app/client.js";
  giscusScript.dataset.repo = "PraxTube/website-rancic-comments";
  giscusScript.dataset.repoId = "R_kgDOMZQGaA";
  giscusScript.dataset.category = "Announcements";
  giscusScript.dataset.categoryId = "DIC_kwDOMZQGaM4ChDaZ";
  giscusScript.dataset.mapping = "url";
  giscusScript.dataset.strict = "0";
  giscusScript.dataset.reactionsEnabled = "1";
  giscusScript.dataset.emitMetadata = "0";
  giscusScript.dataset.inputPosition = "bottom";
  giscusScript.dataset.theme = "preferred_color_scheme";
  giscusScript.dataset.lang = "en";
  giscusScript.crossOrigin = "anonymous";
  giscusScript.async = true;

  var targetElement = document.querySelector('.content-container');
  if (targetElement) {
    targetElement.appendChild(giscusScript);
  } else {
    console.warn('Could not find div class content-container. No comment section added.');
  }
})();
