import { Match } from "./match.model";

export interface League{
    oid?: number,
    id?: number,
    oid_sport?: number,
    name?: string,
    country?: string,
    matches?: Match[]
}