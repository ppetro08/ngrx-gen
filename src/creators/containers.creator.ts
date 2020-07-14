import * as fs from "fs";
import { toPascalCase } from "../helpers/helper";
import { FileName as ModelFileName } from "./models.creator";
import { StateSelectorsFileName, StateReducerFileName } from "./states.creator";

export class ContainersCreator {
  private _name: string;

  private _namePascalCase: string;

  private _path: string;

  constructor(path: string, name: string) {
    this._path = `${path}/containers`;
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
import { Component, OnInit } from '@angular/core';
import { LoadingState } from '@lcs/shared/api';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { State } from '../state/${StateReducerFileName(
  this._name
)}';
import { getCallState, getData } from '../state/${StateSelectorsFileName(
      this._name
    )}';
import { ${ModelFileName(
  this._namePascalCase
)} } from '../models/${this._name}';

@Component({
  selector: 'qmg-${this._name}',
  templateUrl: './${this._name}.component.html',
})
export class ${this._namePascalCase}Component implements OnInit {
  data: Observable<${this._namePascalCase} | null>;

  loading: Observable<boolean>;

  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.data = this.store.pipe(select(getData));
    this.loading = this.store.pipe(select(getCallState)).pipe(map((callState) => callState === LoadingState.Loading));
  }
}
    `;
  }
}

export function FileName(name: string): string {
  return `${name}.component`;
}
