import * as fs from "fs";
import { toPascalCase } from "../helpers/helper";
import { FileName as ModelFileName } from "./models.creator";

export class ViewsCreator {
  private _name: string;

  private _namePascalCase: string;

  private _path: string;

  constructor(path: string, name: string) {
    this._path = `${path}/views`;
    this._name = name;
    this._namePascalCase = toPascalCase(name);
  }

  create() {
    this.createFolder();
    this.createFiles();
  }

  private createFolder() {
    fs.mkdir(this._path, (err) => {
      if (err) {
        throw err?.message;
      }
    });
  }

  private createFiles() {
    const typescriptFileName = `${this._path}/${FileName(this._name)}.ts`;
    fs.writeFile(typescriptFileName, this.componentContents(), (err) => {
      if (err) {
        throw err?.message;
      }
    });

    const templateFileName = `${this._path}/${FileName(this._name)}.html`;
    fs.writeFile(templateFileName, ``, (err) => {
      if (err) {
        throw err?.message;
      }
    });
  }

  private componentContents() {
    return `
import { Component, OnInit, Input } from '@angular/core';
import { LoadingState } from '@lcs/shared/api';

import { ${ModelFileName(this._namePascalCase)} } from '../models/${
      this._name
    }';

@Component({
  selector: 'qmg-${this._name}-view',
  templateUrl: './${this._name}-view.component.html',
})
export class ${this._namePascalCase}ViewComponent implements OnInit {
  @Input() data: ${ModelFileName(this._namePascalCase)} | null;

  @Input() loading: boolean;

  constructor() {}

  ngOnInit() {
  }
}
    `;
  }
}

export function FileName(name: string): string {
  return `${name}-view.component`;
}
