// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
const parentfinder = require('find-parent-dir');
const findupglob = require('find-up-glob');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, "aurelia-files" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// vscode.commands.registerCommand('extension.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed

	// 	// Display a message box to the user
	//    vscode.window.showInformationMessage('Hello World!');
	//});

    context.subscriptions.push(vscode.commands.registerCommand('aurelia-files.addAureliaComponent', createComponent));
    context.subscriptions.push(vscode.commands.registerCommand('aurelia-files.addAureliaService', createService));
	context.subscriptions.push(vscode.commands.registerCommand('aurelia-files.addAureliaInterface', createInterface));
}

function createComponent(args: any) {
	promptAndSaveController(args, 'class');
}

function createService(args: any) {
    promptAndSaveService(args, 'service');
}

function createInterface(args: any) {
    promptAndSaveInterface(args, 'interface');
}

function promptAndSaveInterface(args: { _fsPath: any; } | null, templatetype: string) {
    if (args == null) {
        args = { _fsPath: vscode.workspace.rootPath }
	}
    let incomingpath: string = args._fsPath;
    vscode.window.showInputBox({ ignoreFocusOut: true, prompt: 'Please enter filename', value: 'new' + templatetype })
        .then((newfilename) => {
            if (typeof newfilename === 'undefined') {
                return;
            }

            var newfilepath = incomingpath + path.sep + newfilename;
			
            if (fs.existsSync(newfilepath)) {
                vscode.window.showErrorMessage("File already exists");
                return;
            }

            newfilepath = correctExtension(newfilepath, "ts");

            var originalfilepath = newfilepath;

            var projectrootdir = getProjectRootDirOfFilePath(newfilepath);

            if (projectrootdir == null) {
                vscode.window.showErrorMessage("Unable to find package.json or *.ejs");
                return;
            }

            projectrootdir = removeTrailingSeparator(projectrootdir);

            var newroot = projectrootdir.substr(projectrootdir.lastIndexOf(path.sep) + 1);

            var filenamechildpath = newfilepath.substring(newfilepath.lastIndexOf(newroot));

            var pathSepRegEx = /\//g;
            if (os.platform() === "win32")
                pathSepRegEx = /\\/g;

            newfilepath = path.basename(newfilepath, '.ts');
            openTemplateAndSaveNewFile(templatetype, newfilepath, originalfilepath);
            vscode.window.showInformationMessage('Interface Created!');
        });
}

function promptAndSaveService(args: { _fsPath: any; } | null, templatetype: string) {
    if (args == null) {
        args = { _fsPath: vscode.workspace.rootPath }
	}
    let incomingpath: string = args._fsPath;
    vscode.window.showInputBox({ ignoreFocusOut: true, prompt: 'Please enter filename', value: 'new-' + templatetype })
        .then((newfilename) => {
            if (typeof newfilename === 'undefined') {
                return;
            }

            var newfilepath = incomingpath + path.sep + newfilename;
			
            if (fs.existsSync(newfilepath)) {
                vscode.window.showErrorMessage("File already exists");
                return;
            }

            newfilepath = correctExtension(newfilepath, "ts");

            var originalfilepath = newfilepath;

            var projectrootdir = getProjectRootDirOfFilePath(newfilepath);

            if (projectrootdir == null) {
                vscode.window.showErrorMessage("Unable to find package.json or *.ejs");
                return;
            }

            projectrootdir = removeTrailingSeparator(projectrootdir);

            var newroot = projectrootdir.substr(projectrootdir.lastIndexOf(path.sep) + 1);

            var filenamechildpath = newfilepath.substring(newfilepath.lastIndexOf(newroot));

            var pathSepRegEx = /\//g;
            if (os.platform() === "win32")
                pathSepRegEx = /\\/g;

            newfilepath = path.basename(newfilepath, '.ts');
            openTemplateAndSaveNewFile(templatetype, newfilepath, originalfilepath);
            vscode.window.showInformationMessage('Service Created!');
        });
}

function promptAndSaveController(args: { _fsPath: any; } | null, templatetype: string) {
    if (args == null) {
        args = { _fsPath: vscode.workspace.rootPath }
	}
    let incomingpath: string = args._fsPath;
    vscode.window.showInputBox({ ignoreFocusOut: true, prompt: 'Please enter filename', value: 'new' + templatetype })
        .then((newfilename) => {
            if (typeof newfilename === 'undefined') {
                return;
            }

            var newfilepath = incomingpath + path.sep + newfilename;
			
            if (fs.existsSync(newfilepath)) {
                vscode.window.showErrorMessage("File already exists");
                return;
            }

            newfilepath = correctExtension(newfilepath, "ts");

            var originalfilepath = newfilepath;

            var projectrootdir = getProjectRootDirOfFilePath(newfilepath);

            if (projectrootdir == null) {
                vscode.window.showErrorMessage("Unable to find package.json or *.ejs");
                return;
            }

            projectrootdir = removeTrailingSeparator(projectrootdir);

            var newroot = projectrootdir.substr(projectrootdir.lastIndexOf(path.sep) + 1);

            var filenamechildpath = newfilepath.substring(newfilepath.lastIndexOf(newroot));

            var pathSepRegEx = /\//g;
            if (os.platform() === "win32")
                pathSepRegEx = /\\/g;

            newfilepath = path.basename(newfilepath, '.ts');
			openTemplateAndSaveNewFile(templatetype, newfilepath, originalfilepath);
            saveTemplate(args, 'template', newfilename);
            vscode.window.showInformationMessage('Component Created!');
        });
}

function saveTemplate(args: { _fsPath: any; } | null, templatetype: string, newfilename: string) {
    if (args == null) {
        args = { _fsPath: vscode.workspace.rootPath }
	}
    let incomingpath: string = args._fsPath;

	if (typeof newfilename === 'undefined') {
		return;
	}

	var newfilepath = incomingpath + path.sep + newfilename;
	
	if (fs.existsSync(newfilepath)) {
		vscode.window.showErrorMessage("File already exists");
		return;
	}

	newfilepath = correctExtension(newfilepath, "html");

	var originalfilepath = newfilepath;

	var projectrootdir = getProjectRootDirOfFilePath(newfilepath);

	if (projectrootdir == null) {
		vscode.window.showErrorMessage("Unable to find package.json or *.ejs");
		return;
	}

	projectrootdir = removeTrailingSeparator(projectrootdir);

	var newroot = projectrootdir.substr(projectrootdir.lastIndexOf(path.sep) + 1);

	var filenamechildpath = newfilepath.substring(newfilepath.lastIndexOf(newroot));

	var pathSepRegEx = /\//g;
	if (os.platform() === "win32")
		pathSepRegEx = /\\/g;

	newfilepath = path.basename(newfilepath, '.html');
	openTemplateAndSaveNewFile(templatetype, newfilepath, originalfilepath);
}

function correctExtension(filename: any, filetype: string) {
    if(filetype == "ts"){
        if (path.extname(filename) !== '.ts') {
            if (filename.endsWith('.')) {
                filename = filename + 'ts';
            } else {
                filename = filename + '.ts';
            }
        }
    }
 
    if(filetype == "html"){
        if (path.extname(filename) !== '.html') {
            if (filename.endsWith('.')) {
                filename = filename + 'html';
            } else {
                filename = filename + '.html';
            }
        }
    }

    return filename;
}

function removeTrailingSeparator(filepath : any) {
    if (filepath[filepath.length - 1] === path.sep) {
        filepath = filepath.substr(0, filepath.length - 1);
    }
    return filepath;
}

function getProjectRootDirOfFilePath(filepath : any) {
    var projectrootdir = parentfinder.sync(path.dirname(filepath), 'package.json');
    if (projectrootdir == null) {
        var csprojfiles = findupglob.sync('*.ejs', { cwd: path.dirname(filepath) });
        if (csprojfiles == null) {
            return null;
        }
        projectrootdir = path.dirname(csprojfiles[0]);
    }
    return projectrootdir;
}

function openTemplateAndSaveNewFile(type: string, filename: string, originalfilepath: string) {

    let templatefileName = type + '.tmpl';

    vscode.workspace.openTextDocument(vscode.extensions.getExtension('nishanc.aurelia-files')!.extensionPath + '/templates/' + templatefileName)
        .then((doc: vscode.TextDocument) => {
            let text = doc.getText();

            if(type == 'service') {
                let className = filename;
                if(className.includes('-')) {
                    let x = className.split("-");
                    let word1 = capitalizeFirstLetter(x[0])
                    let word2 = capitalizeFirstLetter(x[1])
                    filename = word1 + word2;
                }
            }

            filename = capitalizeFirstLetter(filename);

            text = text.replace('${classname}', filename);
            let cursorPosition = findCursorInTemlpate(text);
            text = text.replace('${cursor}', '');
            console.log('originalfilepath',originalfilepath)
            fs.writeFileSync(originalfilepath, text);

            vscode.workspace.openTextDocument(originalfilepath).then((doc) => {
                vscode.window.showTextDocument(doc).then((editor) => {
                    let newselection = new vscode.Selection(cursorPosition, cursorPosition);
                    editor.selection = newselection;
                });
            });
        });
}

function capitalizeFirstLetter(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function findCursorInTemlpate(text: string) {
    let cursorPos = text.indexOf('${cursor}');
    let preCursor = text.substr(0, cursorPos);
    let lineNum = preCursor.match(/\n/gi)!.length  == null ? 0 : preCursor.match(/\n/gi)!.length;
    let charNum = preCursor.substr(preCursor.lastIndexOf('\n')).length;
    return new vscode.Position(lineNum, charNum);

}
// this method is called when your extension is deactivated
export function deactivate() {}
