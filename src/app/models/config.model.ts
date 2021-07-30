export interface Config{
    maxAmountCoefficient?: number,
    maxCount?: number,
    bankAccounts?: Account[]
}

export interface Account{
    number?: string,
    bank?: string,
    dni?: number,
    userId?: number,
    id?: number,
    pais?: string
}