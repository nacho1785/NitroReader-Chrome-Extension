function sanitize(text) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }
  
  function highlightText(text) {
    const paragraphs = text.split(/\n/);
    const highlightedParagraphs = paragraphs.map((paragraph) => {
      let output = '';
      let currentWord = '';
  
      for (const char of paragraph) {
        if (/[a-zA-Z\u00C0-\u017F]/.test(char)) {
          currentWord += char;
        } else {
          if (currentWord) {
            output += processWord(currentWord);
            currentWord = '';
          }
          output += char;
        }
      }
  
      if (currentWord) {
        output += processWord(currentWord);
      }
  
      return output;
    });
  
    return highlightedParagraphs.join('<br>');
  }

  function processWord(word) {
    const length = word.length;
    let highlighted;
  
    if (length === 1) {
      highlighted = `<span class="bold-text">${word}</span>`;
    } else if (length === 2 || length === 3) {
      highlighted = `<span class="bold-text">${word[0]}</span>${word.slice(1)}`;
    } else if (length === 4) {
      highlighted = `<span class="bold-text">${word.slice(0, 2)}</span>${word.slice(2)}`;
    } else {
      const halfPlusOne = Math.ceil(length / 2);
      highlighted = `<span class="bold-text">${word.slice(0, halfPlusOne)}</span>${word.slice(halfPlusOne)}`;
    }
  
    return highlighted;
  }
  
  function replaceText(highlightedText, range) {
    const highlightedTextNode = document.createElement('span');
    highlightedTextNode.innerHTML = highlightedText;
  
    range.deleteContents();
    range.insertNode(highlightedTextNode);
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'transformText') {
      const selection = window.getSelection();
      const originalText = sanitize(selection.toString());
      const highlightedText = highlightText(originalText);
  
      const range = selection.getRangeAt(0);
  
      replaceText(highlightedText, range);
    }
  });