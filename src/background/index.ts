chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'FETCH_SPEC') {
    fetch(request.url)
      .then(res => res.text())
      .then(data => sendResponse({ data }))
      .catch(error => sendResponse({ error: error.message }));
    return true; // async
  }
  
  if (request.type === 'OPEN_TAB') {
    chrome.tabs.create({ url: request.url });
    return false;
  }

  if (request.type === 'EXECUTE_REQUEST') {
    const { url, method, headers, body } = request.payload;
    fetch(url, {
      method,
      headers,
      body: method !== 'GET' && method !== 'HEAD' ? body : undefined
    })
      .then(async (res) => {
        const text = await res.text();
        const responseHeaders: Record<string, string> = {};
        res.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });
        sendResponse({
          status: res.status,
          statusText: res.statusText,
          headers: responseHeaders,
          data: text
        });
      })
      .catch(error => sendResponse({ error: error.message }));
    return true; // async
  }
});
