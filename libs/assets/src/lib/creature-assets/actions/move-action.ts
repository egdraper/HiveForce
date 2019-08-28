import { Action } from './action.model';

export class MoveAction extends Action { 
    public name = "Move"
    public range = 5
    public executeWithoutAction = true
    public iconUrl = "../assets/move.png"
    public starting 
    public execute(): boolean { return false }
}