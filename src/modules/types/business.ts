import type { Coupon } from './coupon';
import type { Review } from './review';
import type { BusinessMetadata } from './businessMetadata';

/**
 * Interfaz que representa un negocio (restaurante) en el sistema
 */
export interface Business {
  /** ID único del negocio */
  id: string;

  /** Nombre del negocio */
  nombre: string;

  /** Ubicación o dirección del negocio */
  ubicacion: string;

  /** Descripción general del negocio */
  descripcion: string;

  /** Lista de cupones disponibles del negocio */
  cupones: Coupon[];

  /** Puntaje total del negocio (promedio de todas las reseñas) */
  puntajeTotal: number;

  /** Puntajes por categoría (ej: "comida": 4.5, "servicio": 4.2, "ambiente": 4.8) */
  puntajePorCategoria: Map<string, number> | { [key: string]: number };

  /** Lista de reseñas del negocio */
  resenas: Review[];

  /** Metadatos adicionales del negocio (email, teléfono, redes sociales, etc.) */
  metadata: BusinessMetadata;

  /** Categorías del negocio (ej: "Italiana", "Mexicana", "Fast Food") */
  categorias?: string[];

  /** Foto principal del negocio */
  fotoPrincipal?: string;

  /** Galería de fotos del negocio */
  galeria?: string[];

  /** Número total de reseñas */
  totalResenas?: number;

  /** Fecha de creación del negocio en la plataforma */
  fechaCreacion?: Date;

  /** Última fecha de actualización */
  ultimaActualizacion?: Date;

  /** Indica si el negocio está verificado */
  verificado?: boolean;

  /** Indica si el negocio es premium */
  premium?: boolean;
}
