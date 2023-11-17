let editorUrl = "draft.blogger.com/blog/themes/edit/";
let activeHtml = `
<h1>Blogger Theme 
  <span style="color: var(--current_line);">Dark</span> 
  <span style="color: var(--comment);">Editor</span>
  <span style="font-size: 12px;">by <i><a href="https://github.com/ahmad-su" style="color: var(--purple)">Hendz</a></i></span>
</h1>
<div class='flex-h'>
  <span>Enable dark editor</span>
  <label class="switch">
    <input type="checkbox" />
    <span class="slider"></span>
  </label>
</div>
`;
let inactiveHtml = `
<h1>Blogger Theme Dark Editor 
  <span style="font-size: 12px;">by <i><a href="https://github.com/ahmad-su" style="color: var(--purple)">Hendz</a></i></span>
</h1>
<p>This extension is supposed to only run on the blogger theme editor page</p>
`;

let activeCSSUrl = chrome.runtime.getURL("../css/activeCSS.css");
let activeCSS;

fetch(activeCSSUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.text();
  })
  .then((text) => {
    activeCSS = text;
  })
  .catch((error) => {
    console.error("There was a problem when fetching css:", error);
  });

document.addEventListener("DOMContentLoaded", () => {
  let body = document.querySelector(".body");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let activeTab = tabs[0];
    //if the current tab is on the blogger theme editor page
    if (activeTab && activeTab.url.includes(editorUrl)) {
      console.log("you are on the blogger theme editor page");
      body.innerHTML = activeHtml;

      let mainSwitch = getdarkSwitch();
      chrome.storage.sync.get({ darkSwitchState: false }, (data) => {
        mainSwitch.checked = data.darkSwitchState;
      });

      console.log(mainSwitch);
      mainSwitch.addEventListener("change", (event) => {
        updateStyle(mainSwitch.checked, activeCSS);
        chrome.storage.sync.set({ darkSwitchState: event.target.checked });
      });
    } else {
      console.log("you are somewhere else");
      body.innerHTML = inactiveHtml;
    }
  });
});

function getdarkSwitch() {
  let darkSwitch = document.querySelector(".switch input[type=checkbox]");
  if (darkSwitch) {
    return darkSwitch;
  } else {
    setTimeout(() => {
      getdarkSwitch();
    }, 300);
  }
}

function updateStyle(elmCond, css) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let activeTab = tabs[0];
    if (elmCond) {
      if (css) {
        console.log(`activeCSS ready to send: ${css}`);
        chrome.tabs.sendMessage(activeTab.id, { message: css }).catch((err) => {
          console.log(`Can not send message to content.js: ${err}`);
        });
      }
    } else if (!elmCond) {
      chrome.tabs.sendMessage(activeTab.id, { message: "" }).then((err) => {
        console.log(`Can not send message to content.js: ${err}`);
      });
    }
  });
}
