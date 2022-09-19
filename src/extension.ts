import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {

  console.log(
    'Congratulations, your extension "code-extractor" is now active!'
  );

  context.subscriptions.push(extractText);
  context.subscriptions.push(moveText);
}

const extractText = vscode.commands.registerCommand(
  "extension.extractText",
  () => {
    const editor = vscode.window.activeTextEditor;
    const selectedCode = editor?.document.getText(editor.selection);

    if (!selectedCode) throw new Error("No code selected");

    openDialogAndAppend(selectedCode, "Content Copied");
  }
);

const moveText = vscode.commands.registerCommand("extension.moveText", () => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    throw new Error("No editor");
  }

  // console.log(editor.selection);
  const selection = editor.selection;
  const selectedCode = editor.document.getText(editor.selection);

  openDialogAndAppend(selectedCode, "Content Moved", () => {
    const range = new vscode.Range(selection.start, selection.end);

    editor.edit((builder) => {
      builder.replace(range, "");
    });
  });
});

function openDialogAndAppend(
  selectedCode: string,
  successMessage: string,
  callback?: Function
) {
  vscode.window
    .showOpenDialog({
      canSelectFolders: false,
      canSelectMany: true,
      openLabel: "Append",
    })
    .then((selection) => {
      selection?.forEach((select) => {
        fs.appendFile(select.path, "\n" + selectedCode + "\n", (err) => {
          err && vscode.window.showInformationMessage(err.message);
        });

        vscode.window.showInformationMessage(successMessage);
      });
    })
    .then(() => {
      if (callback) {
        callback();
      }
    });
}

export function deactivate() {}
