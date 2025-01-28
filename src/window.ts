function getWebviewContent(): string {
  return /*html*/`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: sans-serif;
        margin:      1rem;
      }

      #prompt {
        box-sizing: border-box;
        width:      100%;
      }
      #response {
        border:     1px solid #ccc;
        margin-top: 1rem;
        min-height: 50vh;
        padding:    0.5rem;
      }
    </style>
  </head>
  <body>
    <h2>Local DeepSeek-R1 in VSCode</h2>
    <form id="promptForm" action="#">
      <textarea id="prompt" rows="3" placeholder="Ask me anything..."></textarea><br />
      <button id="askBtn" type="submit">Ask</button>
    </form>
    <div id="response"></div>

    <script>
      const vscode = acquireVsCodeApi();

      document.getElementById('promptForm').addEventListener('submit', (e) => {
        e.preventDefault() // Stop the form from submitting

        const text = document.getElementById('prompt').value;
        vscode.postMessage({ command: 'chat', text });
      });

      document.addEventListener('message', e => {
        const { command, text } = e.data;
        log.debug({
          command: command,
          text:    text,
        })

        if (command === 'chatResponse') {
          document.getElementById('response').innerHTML = text;
        }
      });

      window.addEventListener('load', event => {
        document.getElementById('prompt').focus();
      });
    </script>
  </body>
  </html>
  `
}


export default getWebviewContent
