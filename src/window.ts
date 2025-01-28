function getWebviewContent(): string {
  return /*html*/`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <style>
      body { font-family: sans-serif; margin: 1rem; }
      #prompt { width: 100%; box-sizing: border-box; }
      #response { border: 1px solid #ccc; margin-top: 1rem; padding: 0.5rem; min-height: 100%; }
    </style>
  </head>
  <body>
    <h2>Local DeepSeek-R1 in VSCode</h2>
    <textarea id="prompt" rows="3" placeholder="Ask me anything..."></textarea><br />
    <button id="askBtn">Ask</button>
    <div id="response"></div>

    <script>
      const vscode = acquireVsCodeApi();

      document.getElementById('askBtn').addEventListener('click', () => {
        const text = document.getElementById('prompt').value;
        vscode.postMessage({ command: 'chat', text });
      })
    </script>
  </body>
  </html>
  `
}


export default getWebviewContent
