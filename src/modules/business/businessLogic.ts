import type { Business } from '../types/business';
import type { Review } from '../types/review';
import type { Coupon } from '../types/coupon';

/**
 * Valida que un negocio tenga todos los campos requeridos
 * @param business - Negocio a validar
 * @returns {boolean} true si el negocio es válido
 */
export function validateBusiness(business: Business): boolean {
  return (
    business.id &&
    business.nombre &&
    business.ubicacion &&
    business.descripcion &&
    Array.isArray(business.cupones) &&
    business.puntajeTotal !== undefined &&
    business.puntajePorCategoria &&
    Array.isArray(business.resenas) &&
    business.metadata
  );
}

/**
 * Calcula el puntaje promedio de un negocio basado en sus reseñas
 * @param resenas - Array de reseñas
 * @returns {number} Puntaje promedio (0-5)
 */
export function calculateAverageRating(resenas: Review[]): number {
  if (resenas.length === 0) return 0;
  
  const suma = resenas.reduce((acc, resena) => acc + resena.calificacion, 0);
  return Math.round((suma / resenas.length) * 10) / 10;
}

/**
 * Calcula el puntaje por categoría basado en reseñas
 * @param resenas - Array de reseñas
 * @param categorias - Array de nombres de categorías
 * @returns {object} Objeto con puntajes por categoría
 */
export function calculateCategoryRatings(
  resenas: Review[],
  categorias: string[]
): { [key: string]: number } {
  const categoryRatings: { [key: string]: number } = {};

  categorias.forEach((categoria) => {
    categoryRatings[categoria] = calculateAverageRating(resenas);
  });

  return categoryRatings;
}

/**
 * Ordena las reseñas por fecha (más recientes primero)
 * @param resenas - Array de reseñas
 * @returns {Review[]} Array de reseñas ordenadas
 */
export function sortReviewsByDate(resenas: Review[]): Review[] {
  return [...resenas].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
}

/**
 * Obtiene las reseñas de mayor calificación
 * @param resenas - Array de reseñas
 * @param cantidad - Número de reseñas a retornar (default: 5)
 * @returns {Review[]} Array de mejores reseñas
 */
export function getTopReviews(resenas: Review[], cantidad: number = 5): Review[] {
  return [...resenas]
    .sort((a, b) => b.calificacion - a.calificacion)
    .slice(0, cantidad);
}

/**
 * Obtiene las reseñas de menor calificación
 * @param resenas - Array de reseñas
 * @param cantidad - Número de reseñas a retornar (default: 5)
 * @returns {Review[]} Array de peores reseñas
 */
export function getBottomReviews(resenas: Review[], cantidad: number = 5): Review[] {
  return [...resenas]
    .sort((a, b) => a.calificacion - b.calificacion)
    .slice(0, cantidad);
}

/**
 * Filtra reseñas por rango de calificación
 * @param resenas - Array de reseñas
 * @param minCalificacion - Calificación mínima (inclusive)
 * @param maxCalificacion - Calificación máxima (inclusive)
 * @returns {Review[]} Array de reseñas filtradas
 */
export function filterReviewsByRating(
  resenas: Review[],
  minCalificacion: number,
  maxCalificacion: number
): Review[] {
  return resenas.filter(
    (resena) => resena.calificacion >= minCalificacion && resena.calificacion <= maxCalificacion
  );
}

/**
 * Obtiene los cupones activos de un negocio
 * @param cupones - Array de cupones
 * @returns {Coupon[]} Array de cupones activos
 */
export function getActiveCouponsForBusiness(cupones: Coupon[]): Coupon[] {
  return cupones.filter((coupon) => coupon.estado === 'activo');
}

/**
 * Busca un negocio por nombre
 * @param negocios - Array de negocios
 * @param nombre - Nombre del negocio a buscar
 * @returns {Business | undefined} Negocio encontrado o undefined
 */
export function findBusinessByName(
  negocios: Business[],
  nombre: string
): Business | undefined {
  return negocios.find((negocio) => negocio.nombre.toLowerCase() === nombre.toLowerCase());
}

/**
 * Busca negocios por categoría
 * @param negocios - Array de negocios
 * @param categoria - Categoría a buscar
 * @returns {Business[]} Array de negocios en esa categoría
 */
export function findBusinessesByCategory(
  negocios: Business[],
  categoria: string
): Business[] {
  return negocios.filter((negocio) =>
    negocio.categorias?.some((cat) => cat.toLowerCase() === categoria.toLowerCase())
  );
}

/**
 * Ordena negocios por puntaje (mayor a menor)
 * @param negocios - Array de negocios
 * @returns {Business[]} Array de negocios ordenados
 */
export function sortBusinessesByRating(negocios: Business[]): Business[] {
  return [...negocios].sort((a, b) => b.puntajeTotal - a.puntajeTotal);
}

/**
 * Obtiene los negocios premium
 * @param negocios - Array de negocios
 * @returns {Business[]} Array de negocios premium
 */
export function getPremiumBusinesses(negocios: Business[]): Business[] {
  return negocios.filter((negocio) => negocio.premium === true);
}
