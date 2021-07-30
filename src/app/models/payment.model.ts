export interface Payment{
    id?: number,
    userId?: number,
    amount?: number,
    comprobante?: string,
    tipo?: string,
    cta_destino?: string,    
    moneda?: string,
    fecha_solicitud?: Date,
    status?: string,
    fecha_confirmacion?: Date,
    usuario_confirmacion?: number
}