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
				const userPrompt 	 = message.text;
				let 	responseText = '';

				try {
					const streamResponse = await ollama.chat({
						model: 		'deepseek-r1:14b',
						messages: [{ role: 'user', content: userPrompt }],
						stream: 	true,
					});

					for await (const part of streamResponse) {
						responseText += part.message.content
						panel.webview.postMessage({
							command: 'chatResponse',
							text: 	 responseText,
						});
					}
				} catch (err) {
					panel.webview.postMessage({
						command: 'chatResponse',
						text: 	 `${String(err)}`,
					});
				}
			}
		});
	});

	context.subscriptions.push(disposable);
}


export function deactivate() {}
