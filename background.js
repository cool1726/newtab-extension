chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed or updated.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getBookmarks") {
      chrome.bookmarks.getTree((itemTree) => {
          sendResponse({ bookmarks: itemTree });
      });
      return true;
  } else if (message.action === "getBookmarkById") {
      chrome.bookmarks.get(message.id, (bookmark) => {
          sendResponse({ bookmark: bookmark[0] });
      });
      return true;
  } else if (message.action === "getBookmarkChildren") {
      chrome.bookmarks.getChildren(message.id, (children) => {
          sendResponse({ children: children });
      });
      return true;
  }
});
