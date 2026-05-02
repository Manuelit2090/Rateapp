/**
 * Interfaz que representa los metadatos adicionales de un negocio
 * Almacena información de contacto y datos adicionales
 */
export interface BusinessMetadata {
  /** Email de contacto del negocio */
  email?: string;

  /** Página web del negocio */
  pagina?: string;

  /** Número de teléfono del negocio */
  telefono?: string;

  /** Dirección completa del negocio */
  direccion?: string;

  /** Horario de apertura (formato: "09:00 - 22:00") */
  horarioApertura?: string;

  /** Redes sociales del negocio */
  redesSociales?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    [key: string]: string | undefined;
  };

  /** Métodos de pago aceptados */
  metodosPago?: string[];

  /** Capacidad del negocio (número de personas) */
  capacidad?: number;

  /** Servicios especiales (delivery, reservas, etc.) */
  servicios?: string[];

  /** Campos adicionales que el negocio desee agregar */
  [key: string]: any;
}
