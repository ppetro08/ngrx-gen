import * as fs from "fs";
import { toPascalCase } from "../helpers/helper";

export class ModelsCreator {
  private _name: string;

  private _namePascalCase: string;

  private _path: string;

  constructor(path: string, name: string) {
    this._path = `${path}/models`;
    this._name = name;
    this._namePascalCase = toPascalCase(name);
  }

  create() {
    this.createModelsFolder();
    this.createModelFile();
  }

  private createModelsFolder() {
    fs.mkdir(this._path, (err) => {
      if (err) {
        throw err?.message;
      }
    });
  }

  private createModelFile() {
    const typescriptFileName = `${this._path}/${this._name}.ts`;
    fs.writeFile(typescriptFileName, this.modelContents(), (err) => {
      if (err) {
        throw err?.message;
      }
    });
  }

  private modelContents() {
    return `
export interface ${FileName(this._namePascalCase)} {

}
    `;
  }
}

export function FileName(namePascalCase: string): string {
  return `${namePascalCase}`;
}
