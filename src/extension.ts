import * as vscode from 'vscode'
import llama from 'ollama'
import getWebviewContent from './window'


export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('local-deepseek-r1-in-vscode.start', () => {
		vscode.window.showInformationMessage('Hello World from Local DeepSeek-R1 in VSCode!')

		const panel = vscode.window.createWebviewPanel(
			'deepChat',
			'DeepSeek R-1 Chat'
			vscode.ViewColumn.One,
			{ enableScripts: true },
		)

		panel.webview.html = getWebviewContent()
	})

	context.subscriptions.push(disposable)
}


export function deactivate() {}
