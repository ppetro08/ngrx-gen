import * as fs from "fs";
import { toPascalCase, toCamelCase } from "../helpers/helper";
import { ModelsCreator, FileName } from "./models.creator";

export class StatesCreator {
  private _name: string;

  private _nameCamelCase: string;

  private _namePascalCase: string;

  private _path: string;

  constructor(path: string, name: string) {
    this._path = `${path}/state`;
    this._name = name;
    this._nameCamelCase = toCamelCase(name);
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
      `${this._path}/${StateActionsFileName(this._name)}.ts`,
      ``,
      (err) => {
        if (err) {
          throw err?.message;
        }
      }
    );
    fs.writeFile(
      `${this._path}/${StateEffectsFileName(this._name)}.ts`,
      this.effectsContent(),
      (err) => {
        if (err) {
          throw err?.message;
        }
      }
    );
    fs.writeFile(
      `${this._path}/${StateReducerFileName(this._name)}.ts`,
      this.reducersContent(),
      (err) => {
        if (err) {
          throw err?.message;
        }
      }
    );
    fs.writeFile(
      `${this._path}/${StateSelectorsFileName(this._name)}.ts`,
      this.selectorsContent(),
      (err) => {
        if (err) {
          throw err?.message;
        }
      }
    );
  }

  private effectsContent() {
    return `
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as ${this._namePascalCase}Actions from './${StateActionsFileName(
      this._name
    )}'

@Injectable()
export class ${this._namePascalCase}Effects {
  constructor(private actions$: Actions) {
  }
}
	  `;
  }

  private selectorsContent() {
    const feature: string = `${this._nameCamelCase}Feature`;
    const featureKey: string = `${this._nameCamelCase}FeatureKey`;
    return `
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { State, ${featureKey} } from './${StateReducerFileName(this._name)}';

export const ${feature} = createFeatureSelector<State>(${this._nameCamelCase}FeatureKey);

export const getData = createSelector(${feature}, (state) => state.data);

export const getCallState = createSelector(${feature}, (state) => state.callState);
  	`;
  }

  private reducersContent() {
    return `
import { CallState, LoadingState } from '@lcs/shared/api';
import { Action, createReducer, on } from '@ngrx/store';
import { onReset } from '@qmanage/core/store/authentication';

import { ${FileName(this._namePascalCase)} } from '../models/${this._name}';

export const ${this._nameCamelCase}FeatureKey = '${this._nameCamelCase}';

export interface State {
  callState: CallState;
  data: ${FileName(this._namePascalCase)} | null;
}

export const initialState: State = {
  callState: LoadingState.Init,
  data: null,
};

const ${this._nameCamelCase}Reducer = createReducer(
  initialState,
  onReset(initialState),
);

export function reducer(state: State | undefined, action: Action) {
  return ${this._nameCamelCase}Reducer(state, action);
}
	  `;
  }
}

export function StateActionsFileName(name: string): string {
  return `${name}.actions`;
}

export function StateEffectsFileName(name: string): string {
  return `${name}.effects`;
}

export function StateReducerFileName(name: string): string {
  return `${name}.reducer`;
}

export function StateSelectorsFileName(name: string): string {
  return `${name}.selectors`;
}
