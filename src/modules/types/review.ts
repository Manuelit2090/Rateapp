/**
 * Interfaz que representa una reseña o comentario de un usuario sobre un negocio
 */
export interface Review {
  /** ID único de la reseña */
  id: string;

  /** Nombre del usuario que escribió la reseña */
  nombreUsuario: string;

  /** ID del usuario que escribió la reseña */
  idUsuario: string;

  /** Calificación numérica de la reseña (1-5) */
  calificacion: number;

  /** Descripción o comentario de la reseña */
  descripcion: string;

  /** Fecha en que se escribió la reseña */
  fecha: Date;



  /** Fecha de la respuesta del negocio */
  fechaRespuesta?: Date;

  /** Número de personas que encontraron útil la reseña */
  utilidad?: number;
}
