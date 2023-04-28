const menuItemId = 'efficientReading';

chrome.contextMenus.remove(menuItemId, () => {
  if (chrome.runtime.lastError) {
    // Ignore the error if the menu item does not exist
  }

  chrome.contextMenus.create({
    id: menuItemId,
    title: 'Transform to efficient reading',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === menuItemId) {
    chrome.tabs.sendMessage(tab.id, {
      action: 'transformText',
    });
  }
});