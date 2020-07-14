// reconcile files

import * as vscode from "vscode";
import * as fs from "fs";
import {
  ContainersCreator,
  FileName as ContainerFileName,
} from "./creators/containers.creator";
import { ViewsCreator } from "./creators/views.creator";
import { ModelsCreator } from "./creators/models.creator";
import {
  StatesCreator,
  StateActionsFileName,
  StateEffectsFileName,
  StateReducerFileName,
  StateSelectorsFileName,
} from "./creators/states.creator";
import { ServicesCreator } from "./creators/services.creator";
import { ModulesCreator } from "./creators/module.creator";

export function activate(context: vscode.ExtensionContext) {
  const everything = vscode.commands.registerCommand(
    "extension.generateAll",
    async (uri: vscode.Uri) => {
      const path = uri.fsPath;
      await vscode.window
        .showInputBox({ prompt: "Enter the name of your component." })
        .then((name) => {
          if (name) {
            const folderPath = createFolder(path, name);
            createIndexFile(folderPath, name);
            const containersCreator = new ContainersCreator(folderPath, name);
            containersCreator.create();
            const viewsCreator = new ViewsCreator(folderPath, name);
            viewsCreator.create();
            const modelsCreator = new ModelsCreator(folderPath, name);
            modelsCreator.create();
            const statesCreator = new StatesCreator(folderPath, name);
            statesCreator.create();
            const servicesCreator = new ServicesCreator(folderPath, name);
            servicesCreator.create();
            const modulesCreator = new ModulesCreator(folderPath, name);
            modulesCreator.create();
          }
        });
    }
  );

  const state = vscode.commands.registerCommand(
    "extension.generateState",
    async (uri: vscode.Uri) => {
      const path = uri.fsPath;
      const splitPath = path.split("\\");
      const name = splitPath[splitPath.length - 1];

      if (name) {
        const statesCreator = new StatesCreator(path, name);
        statesCreator.create();
      }
    }
  );

  context.subscriptions.push(everything, state);
}

function createFolder(path: string, name: string) {
  const folderPath = `${path}/${name}`;
  fs.mkdir(folderPath, (err) => {
    if (err) {
      throw err?.message;
    }
  });
  return folderPath;
}

function createIndexFile(path: string, name: string) {
  const contents = `
export * from './containers/${ContainerFileName(name)}';
export * from './models/${name}';
export * from './state/${StateActionsFileName(name)}';
export * from './state/${StateEffectsFileName(name)}';
export * from './state/${StateReducerFileName(name)}';
export * from './state/${StateSelectorsFileName(name)}';
	`;
  fs.writeFile(`${path}/index.ts`, contents, (err) => {
    if (err) {
      throw err?.message;
    }
  });
}