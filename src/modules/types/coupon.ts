/**
 * Interfaz que representa un cupón en el sistema
 */
export interface Coupon {
  /** ID único del cupón */
  id: string;

  /** Foto o imagen del cupón */
  foto: string;

  /** Imagen adicional del cupón */
  imagen: string;

  /** Negocio o restaurante al que pertenece */
  negocio: string;

  /** Descripción detallada del cupón */
  descripcion: string;

  /** Código único para canjear el cupón (único por usuario) */
  clave: string;

  /** Fecha de creación del cupón */
  fechaCreacion?: Date;

  /** Fecha de expiración del cupón */
  fechaExpiracion?: Date;

  /** Estado del cupón (activo, canjeado, expirado) */
  estado?: 'activo' | 'canjeado' | 'expirado';
}
