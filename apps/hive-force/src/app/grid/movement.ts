// import { ShortestPath } from "app/path/shortest-path";
// import { Cell } from "app/model/cell";
// import { Character } from "app/character/character";

// export class Movement {
//     private characters: Character[]
//     private timer: any;
//     private redirect: any;

//     private shortestPath: ShortestPath;

//     public startMovement(path: Cell[]) {
//       const startingPoint = path.pop();
//       if (!!this.timer && this.timer.state === "scheduled") {
//         this.redirect.path = path;
//       } else {
//         this.moveCharacter(path);
//       }
//     }

//       private moveCharacter(path: Cell[]): void {
//           const d = path.pop();
//           if (d) {
//             this.move(d.posX, d.posY, path);
//           }
//       }
    
//       private move(x: number, y: number, path: Cell[]) {
//         if (this.leftPosition % 50 === 0 && this.topPosition % 50 === 0) {
    
//           if (this.redirect) {
//             clearTimeout(this.timer);
//             x = this.redirect.x;
//             y = this.redirect.y;
//             this.redirect = null;
//            // this.startMovement(redirect.pathx, y);
//           }
//         }
    
//         const xMove = ((this.leftPosition - x) < 0) ? 2 : -2;
//         const yMove = ((this.topPosition - y) < 0) ? 2 : -2;
    
//         const xDistance = Math.ceil((x - this.leftPosition) / 2);
//         const yDistance = Math.ceil((y - this.topPosition) / 2);
//         let xArrived = false;
//         let yArrived = false;
    
//         if (xDistance >= 1 || xDistance <= -1) {
//           this.leftPosition += xMove;
//         } else {
//           xArrived = true;
//         }
    
//         if (yDistance >= 1 || yDistance <= -1) {
//           this.topPosition += yMove;
//         } else {
//           yArrived = true;
//         }
    
//         if (!xArrived || !yArrived) {
//           this.timer = setTimeout(() => {
//             this.move(x, y, path);
//           }, 10);
//         } else {
//           this.moveCharacter(path);
//         }
//       }
// }