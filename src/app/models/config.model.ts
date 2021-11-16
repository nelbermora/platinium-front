export interface Config{
    maxAmountCoefficient?: number,
    maxCount?: number,
    bankAccounts?: Account[],
    maxOuAndRl?: number
}

export interface Account{
    number?: string,
    bank?: string,
    dni?: number,
    userId?: number,
    id?: number,
    pais?: string
}