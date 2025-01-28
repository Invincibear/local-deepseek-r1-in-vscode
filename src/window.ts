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

      #userPromptInput {
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
      <textarea id="userPromptInput" rows="4" placeholder="Ask anything..."></textarea><br />
      <button id="askButton" type="submit">Ask</button>
      <button id="cancelButton" type="reset">Cancel</button>
    </form>
    <div id="response"></div>

    <script>
      const vscode = acquireVsCodeApi();
      let   history = [] // { prompt: "", response: "" }

      document.getElementById('promptForm').addEventListener('submit', (e) => {
        e.preventDefault() // Stop the form from submitting

        const promptId = history.length
        const userPrompt     = document.getElementById('userPromptInput').value;

        history[promptId] = {
          userPrompt:   userPrompt,
          responseText: "",
        }

        vscode.postMessage({
          command:    'chat',
          promptId:   promptId,
          userPrompt: userPrompt,
        });

        userPrompt = "" // Clear the prompt textarea after a question has been asked
      });

      document.getElementById('cancelButton').addEventListener('click', (e) => {
        e.preventDefault() // Stop the form from submitting

        const promptId   = history.length
        const userPrompt = document.getElementById('prompt').value;

        vscode.postMessage({
          command:  'cancel',
          promptId: promptId,
        });
      });

      window.addEventListener('message', e => {
        const { command, promptId, text } = e.data;

        if (command === 'chatResponse') {
          history[promptId].responseText                = text
          document.getElementById('response').innerHTML = text;
        }
      });

      window.addEventListener('load', () => {
        document.getElementById('prompt').focus();
      });
    </script>
  </body>
  </html>
  `
}


export default getWebviewContent
