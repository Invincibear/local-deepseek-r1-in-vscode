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
      button {
        height: 2rem;
      }

      div.history {
        border-radius: 25px;
        padding: 10px 20px;
      }
      div.userPromptHistory {
        background-color: rgba(50, 50, 50, 0.85);
        margin-left: 20%;
        margin-top: 3rem;
        width: calc(80% - 40px);
      }
      div.r1ResponseHistory {
        background-color: rgb(35, 35, 35);
        margin-right: 20%;
        margin-top: 1rem;
        width: 80%;
      }
      div.r1Icon {
        background: url(./favicon.ico);
        border: 1px solid #ccc;
        border-radius: 2px;
        left: -25px;
        position: relative;
        width: 50px
      }

      div#response {
        border:     1px solid #ccc;
        margin-top: 1rem;
        min-height: 50vh;
        padding:    0.5rem;
      }
      textarea#userPrompt {
        box-sizing: border-box;
        width:      100%;
      }
      button#cancelButton {
        display: none;
      }
      select#r1Model {
        height: 1.5rem;
      }
    </style>
  </head>
  <body>
    <h2>Local DeepSeek-R1 in VSCode</h2>
    <div id="response"></div>
    <br />
    <form id="promptForm" action="#">
      <textarea id="userPrompt" rows="4" placeholder="Ask anything..."></textarea><br />
      <button id="askButton" type="submit">Ask R1</button>
      <button id="cancelButton">Cancel</button>
      <br />
      <label for="r1Model">DeekSeek R1 Model to use: </label>
      <select id="r1Model">
        <option value="1.5b">1.5b</option>
        <option value="7b">7b</option>
        <option value="8b">8b</option>
        <option value="14b" selected="selected">14b</option>
        <option value="32b">32b</option>
        <option value="70B">70B</option>
      </select>
    </form>

    <script>
      const vscode         = acquireVsCodeApi();
      let   promptsHistory = [] // { promptId: #, r1Model: "14b", responseText: "", userPrompt: "" }

      document.getElementById('promptForm').addEventListener('submit', (e) => {
        e.preventDefault(); // Stop the form from submitting

        const promptId   = promptsHistory.length;
        const r1Model    = document.getElementById('r1Model').value;
        const userPrompt = document.getElementById('userPrompt').value;

        promptsHistory[promptId] = {
          r1Model:      r1Model,
          responseText: "",
          userPrompt:   userPrompt,
          //userPrompt:   '<div class="userPromptHistory">' + userPrompt + '</div>',
        };

        vscode.postMessage({
          command:    'chat',
          promptId:   promptId,
          r1Model:    r1Model,
          userPrompt: userPrompt,
        });

        // Clear the prompt textarea after a question has been asked
        document.getElementById('userPrompt').value = "";

        document.getElementById('response').innerHTML += '<div id="userPrompt-' + promptId + '" class="history userPromptHistory">' + userPrompt + '</div>'
        document.getElementById('response').innerHTML += '<div id="r1Response-' + promptId + '" class="history r1ResponseHistory"></div>'
      });

      document.getElementById('cancelButton').addEventListener('click', (e) => {
        e.preventDefault(); // Stop the form from submitting

        const promptId   = promptsHistory.length;
        const userPrompt = document.getElementById('prompt').value;

        vscode.postMessage({
          command:  'cancel',
          promptId: promptId,
        });
      });

      window.addEventListener('message', e => {
        const { command, promptId, responseText } = e.data;

        if (command === 'chatResponse') {
          promptsHistory[promptId].responseText = responseText;
          document.getElementById('r1Response-' + promptId).innerHTML = promptsHistory[promptId].responseText;
          // updateResponseDiv();
        }
      });

      window.addEventListener('load', () => {
        document.getElementById('userPrompt').focus();
      });
    </script>
  </body>
  </html>
  `
}
