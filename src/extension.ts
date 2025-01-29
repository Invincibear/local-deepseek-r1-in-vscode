import * as vscode from 'vscode';
import ollama from 'ollama';
import getWebviewContent from './window';


export function activate(context: vscode.ExtensionContext) {
	// const controller = new AbortController()
	const disposable = vscode.commands.registerCommand('local-deepseek-r1-in-vscode.start', () => {
	const panel      = vscode.window.createWebviewPanel(
			'deepChat',
			'DeepSeek R-1 Chat',
			vscode.ViewColumn.One,
			{ enableScripts: true },
		);

		panel.webview.html = getWebviewContent();

		panel.webview.onDidReceiveMessage(async (message: any) => {
			if (message.command === 'chat') {
				const r1Model      = message.r1Model;
				const promptId 	   = message.promptId;
				const userPrompt 	 = message.userPrompt;
				let 	responseText = '' // '<div class="r1ResponseHistory">';

				try {
					const streamResponse = await ollama.chat({
						model: 		`deepseek-r1:${r1Model}`,
						stream: 	true,

						messages: [{
							role:    'user',
							content: userPrompt,
						}],
					});

					for await (const part of streamResponse) {
						responseText += part.message.content
						console.log({
							promptId:     promptId,
							userPrompt:   userPrompt,
							responseText: responseText,
						})

						panel.webview.postMessage({
							command:      'chatResponse',
							promptId:     promptId,
							responseText: responseText,
						});
					}
				} catch (err) {
					panel.webview.postMessage({
						command:  		'chatResponse',
						promptId:		  promptId,
						responseText: `${String(err)}`,
					});
				}
				// } finally {
				// 	responseText += "</div>"

				// 	panel.webview.postMessage({
				// 		command:      'chatResponse',
				// 		promptId:     promptId,
				// 		responseText: responseText, // TODO: trim \n\n\n\n from start, trim trailing newline from end
				// 	});

				// 	console.log({
				// 		promptId:     promptId,
				// 		userPrompt:   userPrompt,
				// 		responseText: responseText, // TODO: trim \n\n\n\n from start, trim trailing newline from end
				// 	})
				// }
			}
			else if (message.command === 'cancel') {
				ollama.abort()
			}
		});
	});

	context.subscriptions.push(disposable);
}


export function deactivate() {}
