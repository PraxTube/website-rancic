document.getElementById('copy-email').addEventListener('click', function() {
    // Text to be copied
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
