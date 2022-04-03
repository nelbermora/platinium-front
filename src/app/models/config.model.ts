export interface Config{
    maxAmountCoefficient?: number,
    maxCount?: number,
    minCount?: number,
    bankAccounts?: Account[],
    maxOuAndRl?: number,
    maxWins?: number
}

export interface Account{
    number?: string,
    bank?: string,
    dni?: number,
    userId?: number,
    id?: number,
    pais?: string
}