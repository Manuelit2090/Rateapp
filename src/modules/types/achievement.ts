/**
 * Interfaz que representa un logro en el sistema
 */
export interface Achievement {
  /** ID único del logro */
  id: string;

  /** Nombre del logro */
  nombre: string;

  /** Descripción del logro */
  descripcion: string;

  /** Ícono o imagen del logro */
  icono: string;

  /** Puntos que otorga el logro */
  puntos?: number;

  /** Fecha en que se desbloqueó el logro */
  fechaDesbloqueado?: Date;

  /** Indica si el logro está desbloqueado */
  desbloqueado: boolean;

  /** Progreso actual hacia el logro (0-100) */
  progreso?: number;
}
