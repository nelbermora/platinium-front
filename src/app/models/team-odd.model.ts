import { Team } from "./team.model";

export interface TeamOdd{
    oid?: number,
    oid_match?: number,
    oid_team?: number,
    matchId?: number,
    team?: Team,
    win?: number,
    win5?: number,
    overUnder?: number,
    ouLetter?: string,
    ouHandicap?: number,
    overUnder5?: number,
    ouHandicap5?: number,
    ouLetter5?: string,
    runLine?: number,
    rlHandicap?: number,
    runLine5?: number,
    rlHandicap5?: number,
    scoresFirst?: number,
    totalHits?: number,
    thLetter?: string,
    thHandicap?: number,
    tieValue?: number,
    tieValue5?: number,
    position?: number,
    halfEnabled?: boolean

}