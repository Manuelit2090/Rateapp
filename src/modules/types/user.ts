import type { Coupon } from './coupon';
import type { Achievement } from './achievement';

/**
 * Interfaz que representa el objeto User del sistema
 */
export interface User {
  /** ID único del usuario */
  id?: string;

  /** Nombre del usuario */
  nombre: string;

  /** Total de puntos acumulados */
  totalPuntos: number;

  /** Lista de cupones disponibles del usuario */
  cupones: Coupon[];

  /** Lista de logros obtenidos */
  logros: Achievement[];

  /** Total de reseñas que ha escrito */
  totalResenas: number;

  /** Nivel actual del usuario */
  nivelActual: number;

  /** Email del usuario */
  email?: string;

  /** Foto de perfil */
  fotoPerfil?: string;

  /** Fecha de creación de la cuenta */
  fechaCreacion?: Date;

  /** Última fecha de actualización */
  ultimaActualizacion?: Date;
}
