import * as vscode from 'vscode';
import ollama from 'ollama';
import getWebviewContent from './window';


export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('local-deepseek-r1-in-vscode.start', () => {
		const panel = vscode.window.createWebviewPanel(
			'deepChat',
			'DeepSeek R-1 Chat',
			vscode.ViewColumn.One,
			{ enableScripts: true },
		);

		panel.webview.html = getWebviewContent();

		panel.webview.onDidReceiveMessage(async (message: any) => {
			if (message.command === 'chat') {
				const promptId 	   = message.promptId;
				const userPrompt 	 = message.userPrompt;
				let 	responseText = '';

				try {
					const streamResponse = await ollama.chat({
						model: 		'deepseek-r1:14b',
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
							command:  'chatResponse',
							promptId: promptId,
							text: 	  responseText,
						});
					}
				} catch (err) {
					panel.webview.postMessage({
						command:  'chatResponse',
						// promptId: promptId,
						text: 	  `${String(err)}`,
					});
				}
			}
			else if (message.command === 'cancel') {
				ollama.abort()
			}
		});
	});

	context.subscriptions.push(disposable);
}


export function deactivate() {}
