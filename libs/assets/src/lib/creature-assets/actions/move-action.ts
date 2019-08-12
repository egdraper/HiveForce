import { Action } from './action.model';

export class MoveAction extends Action { 
    public name = "Move"
    public executeWithoutAction = true
    public iconUrl = "../assets/move.png"
    public execute(): boolean { return false }
}