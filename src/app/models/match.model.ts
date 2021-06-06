import { TeamOdd } from "./team-odd.model";

export interface Match{
    oid?: number,
    id?: number,
    date?: Date,
    teamA?: TeamOdd,
    teamB?: TeamOdd,
    firstInningScoreYes?: number,
    firstInningScoreNo?: number

}