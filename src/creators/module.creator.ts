import * as fs from "fs";
import { toPascalCase, toCamelCase } from "../helpers/helper";

import { FileName as ContainerFileName } from "./containers.creator";
import { FileName as ViewFileName } from "./views.creator";

export class ModulesCreator {
  private _name: string;

  private _nameCamelCase: string;

  private _namePascalCase: string;

  private _path: string;

  constructor(path: string, name: string) {
    this._path = path;
    this._name = name;
    this._nameCamelCase = toCamelCase(name);
    this._namePascalCase = toPascalCase(name);
  }

  create() {
    const typescriptFileName = `${this._path}/${FileName(this._name)}.ts`;
    fs.writeFile(typescriptFileName, this.modelContents(), (err) => {
      if (err) {
        throw err?.message;
      }
    });
  }

  private modelContents() {
    return `
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ${this._namePascalCase}Effects } from './state/${this._name}.effects';
import { reducer, ${this._nameCamelCase}FeatureKey } from './state/${
      this._name
    }.reducer';
import { ${
      this._namePascalCase
    }Component } from './containers/${ContainerFileName(this._name)}'
import { ${this._namePascalCase}ViewComponent } from './views/${ViewFileName(
      this._name
    )}'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature(${this._nameCamelCase}FeatureKey, reducer),
    EffectsModule.forFeature([${this._namePascalCase}Effects]),
  ],
  declarations: [${this._namePascalCase}Component, ${
      this._namePascalCase
    }ViewComponent],
})

export class ${this._namePascalCase}Module {}
    `;
  }
}

export function FileName(name: string): string {
  return `${name}.module`;
}
