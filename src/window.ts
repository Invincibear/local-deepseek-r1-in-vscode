export default function getWebviewContent(): string {
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

      textarea#userPrompt {
        box-sizing: border-box;
        width:      100%;
      }
      div#response {
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
      <label for="r1Model">DeekSeek R1 Model to use: </label>
      <select id="r1Model">
        <option value="1.5b">1.5b</option>
        <option value="7b">7b</option>
        <option value="8b">8b</option>
        <option value="14b" selected="selected">14b</option>
        <option value="32b">32b</option>
        <option value="70B">70B</option>
      </select>
      <textarea id="userPrompt" rows="4" placeholder="Ask anything..."></textarea><br />
      <button id="askButton" type="submit">Ask</button>
      <button id="cancelButton" style="visibility: none">Cancel</button>
    </form>
    <div id="response"></div>

    <script>
      const vscode = acquireVsCodeApi();
      let   history = [] // { prompt: "", promptId: #, r1Model: "14b", responseText: "" }

      document.getElementById('promptForm').addEventListener('submit', (e) => {
        e.preventDefault(); // Stop the form from submitting

        const promptId   = history.length;
        const r1Model    = document.getElementById('r1Model').value;
        const userPrompt = document.getElementById('userPrompt').value;

        history[promptId] = {
          r1Model:      r1Model,
          responseText: "",
          userPrompt:   userPrompt,
        };

        vscode.postMessage({
          command:    'chat',
          promptId:   promptId,
          r1Model:    r1Model,
          userPrompt: userPrompt,
        });

        // Clear the prompt textarea after a question has been asked
        document.getElementById('userPrompt').value = "";
      });

      document.getElementById('cancelButton').addEventListener('click', (e) => {
        e.preventDefault(); // Stop the form from submitting

        const promptId   = history.length;
        const userPrompt = document.getElementById('prompt').value;

        vscode.postMessage({
          command:  'cancel',
          promptId: promptId,
        });
      });

      window.addEventListener('message', e => {
        const { command, promptId, text } = e.data;

        if (command === 'chatResponse') {
          history[promptId].responseText                = text;
          // document.getElementById('response').innerHTML = text;
          updateResponseDiv();
        }
      });

      window.addEventListener('load', () => {
        document.getElementById('prompt').focus();
      });

      function updateResponseDiv() {

      }
    </script>
  </body>
  </html>
  `
}
