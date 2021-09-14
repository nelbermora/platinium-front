export interface User{
    primerNombre?: string,
    segundoNombre?: string,
    primerApellido?: string,
    segundoApellido?: string,
    documento?: number,
    fechaNacimiento?: Date,
    paisResidencia?: string,
    cod_tel_pais?: number,
    telefono?: number,
    correo?: string,
    id?: number,
    type?: string,
    password?: string,
    newPassword?: string,
    fechaRegistro?: string,
    cuenta?: string,
    banco?: string,
    moneda?: string,
    status?: string,
    saldo?: number,
    singles?: Currency,
    doubles?: Currency,
    parlays?: Currency
}

export interface Currency{
    jugado: number,
    ganado: number,
    total: number
}