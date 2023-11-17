let style = document.createElement("style");
style.setAttribute("id", "blogger-dark-stylist");
let head = document.querySelector("head");
let lastCSS = localStorage.getItem("lastCSS");
style.textContent = lastCSS;
head.appendChild(style);

chrome.runtime.onMessage.addListener(
  function(request, _sender, _sendResponse) {
    // Check if the message contains the data
    const receivedData = request.message;
    style.textContent = receivedData;
    localStorage.setItem("lastCSS", receivedData);
    // location.reload();
    // Handle the received data, e.g., display it in the console
    // console.log(style);
  },
);
