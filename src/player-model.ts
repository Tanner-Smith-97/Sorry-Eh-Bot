import { ObjectId, ObjectID } from "mongodb";

export default class PlayerModel {
    public _id: ObjectId;
    public points: number = 0;
    public playerId: string;

    constructor(playerId: string){
        this.playerId = playerId;
    }
}