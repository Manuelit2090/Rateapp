import type { Coupon } from '../types/coupon';

/**
 * Valida que un cupón tenga todos los campos requeridos
 * @param coupon - Cupón a validar
 * @returns {boolean} true si el cupón es válido
 */
export function validateCoupon(coupon: Coupon): boolean {
  return (
    coupon.id &&
    coupon.foto &&
    coupon.imagen &&
    coupon.negocio &&
    coupon.descripcion &&
    coupon.clave
  );
}

/**
 * Verifica si un cupón está activo y no expirado
 * @param coupon - Cupón a verificar
 * @returns {boolean} true si el cupón está activo
 */
export function isCouponActive(coupon: Coupon): boolean {
  if (coupon.estado !== 'activo') {
    return false;
  }

  if (coupon.fechaExpiracion) {
    return new Date() <= new Date(coupon.fechaExpiracion);
  }

  return true;
}

/**
 * Canjea un cupón (marca como canjeado)
 * @param coupon - Cupón a canjear
 * @returns {Coupon} Cupón actualizado
 */
export function redeemCoupon(coupon: Coupon): Coupon {
  return {
    ...coupon,
    estado: 'canjeado',
  };
}

/**
 * Obtiene los cupones activos de una lista
 * @param cupones - Lista de cupones
 * @returns {Coupon[]} Array de cupones activos
 */
export function getActiveCoupons(cupones: Coupon[]): Coupon[] {
  return cupones.filter((coupon) => isCouponActive(coupon));
}

/**
 * Obtiene los cupones canjeados de una lista
 * @param cupones - Lista de cupones
 * @returns {Coupon[]} Array de cupones canjeados
 */
export function getRedeemedCoupons(cupones: Coupon[]): Coupon[] {
  return cupones.filter((coupon) => coupon.estado === 'canjeado');
}

/**
 * Obtiene los cupones expirados de una lista
 * @param cupones - Lista de cupones
 * @returns {Coupon[]} Array de cupones expirados
 */
export function getExpiredCoupons(cupones: Coupon[]): Coupon[] {
  return cupones.filter((coupon) => coupon.estado === 'expirado');
}

/**
 * Busca un cupón por su clave
 * @param cupones - Lista de cupones
 * @param clave - Clave del cupón a buscar
 * @returns {Coupon | undefined} Cupón encontrado o undefined
 */
export function findCouponByKey(cupones: Coupon[], clave: string): Coupon | undefined {
  return cupones.find((coupon) => coupon.clave === clave);
}

/**
 * Busca cupones por negocio
 * @param cupones - Lista de cupones
 * @param negocio - Nombre del negocio a buscar
 * @returns {Coupon[]} Array de cupones del negocio
 */
export function findCouponsByBusiness(cupones: Coupon[], negocio: string): Coupon[] {
  return cupones.filter((coupon) => coupon.negocio.toLowerCase() === negocio.toLowerCase());
}
