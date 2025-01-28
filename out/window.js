"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getWebviewContent() {
    return /*html*/ `
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
        vscode.postMessage({
          command: 'chat',
          text,
        });
      });

      window.addEventListener('message', e => {
        const { command, text } = e.data;

        if (command === 'chatResponse') {
          document.getElementById('response').innerHTML = text;
        }
      });

      window.addEventListener('load', () => {
        document.getElementById('prompt').focus();
      });
    </script>
  </body>
  </html>
  `;
}
exports.default = getWebviewContent;
//# sourceMappingURL=window.js.map