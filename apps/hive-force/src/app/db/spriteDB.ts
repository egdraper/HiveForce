import { SpriteModel } from '@hive-force/assets';

export class DB {
  public get(spriteName: string): SpriteModel {
    return spriteDB[spriteName];
  }
}

const spriteDB: {[name: string]: SpriteModel } = {
 "halfElf": {
    name: 'Half Elf',
    imageAdjustment: {
      down: {
        order: [0,1,2,1],
        sprite: [{x: 0, y: -290}, {x: -52, y: -290 }, {x: -104, y: -290 }]
      },
      left: {
        order: [0,1,2,1],
        sprite: [{x: 0, y: -360}, {x: -52, y: -360 }, {x: -104, y: -360 }]
      },
      up: {
        order: [0,1,2,1],
        sprite: [{x: 0, y: -504}, {x: -52, y: -504 }, {x: -104, y: -504 }]
      },
      right: { 
        order: [0,1,2,1],
        sprite: [{x: 0, y: -432}, {x: -52, y: -432 }, {x: -104, y: -432 }]
      }
    },
    imgBottomOffset: 5,
    containerWidth: 50,
    containerHeight: 75,
    locY: 0,
    locX: 0,
    imgSource: '../assets/motw.png',
    imgSheetWidth: '100%',
    imgSpriteTopOffset: -9,
    imgSpriteLeftOffset: -1,
    imageHeight: 'auto',
    imageWidth: '100%',
    performingAction: false,
    key: 'down',
    positionNumber: 0
  },
  "blondHuman": {
    name: 'Blond Human',
    imageAdjustment: {
      down: {
        order: [0, 1, 2, 1],
        sprite: [{ x: 0, y: -9 }, { x: -52, y: -9 }, { x: -104, y: -9 }]
      },
      left: {
        order: [0, 1, 2, 1],
        sprite: [{ x: 0, y: -80 }, { x: -52, y: -80 }, { x: -104, y: -80 }]
      },
      up: {
        order: [0, 1, 2, 1],
        sprite: [{ x: 0, y: -220 }, { x: -52, y: -220 }, { x: -104, y: -220 }]
      },
      right: {
        order: [0, 1, 2, 1],
        sprite: [{ x: 0, y: -150 }, { x: -52, y: -150 }, { x: -104, y: -150 }]
      }
    },
    imgBottomOffset: 5,
    containerWidth: 50,
    containerHeight: 75,
    locY: 0,
    locX: 0,
    imgSource: '../assets/motw.png',
    imgSheetWidth: '',
    imgSpriteTopOffset: -9,
    imgSpriteLeftOffset: -1,
    imageHeight: 'auto',
    imageWidth: '100%',
    performingAction: false,
    key: 'down',
    positionNumber: 0
  },
  "basicSkeleton": {
    name: 'Basic Skeleton',
    imageAdjustment: {  
      down: { 
        order: [0,1,2,1],
        sprite: [{x: -313, y: -2},   {x: -365, y: -2 },   {x: -417, y: -2 }]
      },
      left: {
        order: [0,1,2,1],
        sprite: [{x: -313, y: -75},  {x: -365,  y: -75 },  {x: -417, y: -75 }]
      },
      right: {
        order: [0,1,2,1],
        sprite: [{x: -313, y: -147}, {x: -365,  y: -147 }, {x: -417, y: -147 }]
      },
      up: {
        order: [0,1,2,1],
        sprite: [{x: -313, y: -221}, {x: -365,  y: -221 }, {x: -417, y: -221 }]
      }
    },
    imgBottomOffset: 5,
    containerWidth: 50,
    containerHeight: 75,
    locY: 0,
    locX: 0,
    imgSource: '../assets/motw.png',
    imgSheetWidth: '',
    imgSpriteTopOffset: -9,
    imgSpriteLeftOffset: -1,
    imageHeight: 'auto',
    imageWidth: '100%',
    performingAction: false,
    key: 'down',
    positionNumber: 0
  }
}
