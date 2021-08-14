import { OddParlay } from "./odd-parlay.model";

export interface Parlay{
    userId?: number,
    date?: Date,
    betAmount?: number,
    winAmount?: number,
    odds?: OddParlay[],
    oid?: number,
    winAmountInicial?: number,
    status?: string
}