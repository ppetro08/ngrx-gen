import * as fs from "fs";
import { toPascalCase, toCamelCase } from "../helpers/helper";

export class ServicesCreator {
  private _name: string;

  private _namePascalCase: string;

  private _path: string;

  constructor(path: string, name: string) {
    this._path = `${path}/services`;
    this._name = name;
    this._namePascalCase = toPascalCase(name);
  }

  create() {
    this.createFolders();
    this.createFiles();
  }

  private createFolders() {
    fs.mkdir(this._path, (err) => {
      if (err) {
        throw err?.message;
      }
    });
  }

  private createFiles() {
    fs.writeFile(
      `${this._path}/${FileName(this._name)}.ts`,
      this.componentContents(),
      (err) => {
        if (err) {
          throw err?.message;
        }
      }
    );
  }

  private componentContents() {
    return `
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExecutionResult, LcsApiService } from '@lcs/shared/api';

@Injectable({providedIn: 'root'})
export class ${this._namePascalCase}Service {
  constructor(private apiService: LcsApiService, private httpClient: HttpClient) {

  }
}
	  `;
  }
}

export function FileName(name: string): string {
  return `${name}.service`;
}
