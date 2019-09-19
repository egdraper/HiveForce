import { Injectable } from '@angular/core';
import { MapAsset } from '../assets.model';
import { cloneDeep } from "lodash";


@Injectable()
export class AssetService {
  public activeAssets: {[key: string]: MapAsset } = {}
  public mapAssets: {[key: string]: MapAsset } = {}
  
  constructor() {}

  public add(assetKey: string): void {
    this.activeAssets[Date.now().toString()] = cloneDeep(this.mapAssets[assetKey])
  }

  public remove(id: string): void {
    delete this.activeAssets[id]
  }

}