import { League } from "./league.model";

export interface Sport{
    oid?: number,
    id?: number,
    name?: string,
    leagues?: League[]
}