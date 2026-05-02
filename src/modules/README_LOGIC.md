# Módulo de Lógica del Usuario y Recompensas

## Estructura Creada

### Carpeta `/types`
Contiene las interfaces TypeScript para los tipos principales del sistema:

- **`user.ts`** - Interfaz `User` que define la estructura del objeto usuario con:
  - ID único
  - Nombre
  - Total de puntos
  - Lista de cupones
  - Lista de logros
  - Total de reseñas
  - Nivel actual
  - Datos adicionales (email, foto de perfil, fechas)

- **`coupon.ts`** - Interfaz `Coupon` que define la estructura de un cupón con:
  - ID único
  - Foto e imagen
  - Negocio asociado
  - Descripción
  - Clave única (código para canjear)
  - Fechas de creación y expiración
  - Estado (activo, canjeado, expirado)

- **`achievement.ts`** - Interfaz `Achievement` que define la estructura de un logro con:
  - ID único
  - Nombre y descripción
  - Ícono
  - Puntos que otorga
  - Fecha de desbloqueado
  - Progreso (0-100)

### Carpeta `/user`
Contiene la lógica relacionada con datos y gestión del usuario:

- **`getUserData.js`** - Funciones principales:
  - `getUserData(userId)` - Obtiene todos los datos del usuario desde la BD
  - `getUserCoupons(userId)` - Obtiene los cupones del usuario
  - `getUserAchievements(userId)` - Obtiene los logros del usuario
  - `getUserLevel(userId)` - Obtiene el nivel actual
  - `getUserPoints(userId)` - Obtiene los puntos totales

### Carpeta `/rewards`
Contiene la lógica de gestión de cupones y recompensas:

- **`couponLogic.ts`** - Funciones de utilidad para cupones:
  - `validateCoupon()` - Valida que un cupón tenga todos los campos
  - `isCouponActive()` - Verifica si un cupón está activo
  - `redeemCoupon()` - Marca un cupón como canjeado
  - `getActiveCoupons()` - Filtra cupones activos
  - `getRedeemedCoupons()` - Filtra cupones canjeados
  - `getExpiredCoupons()` - Filtra cupones expirados
  - `findCouponByKey()` - Busca un cupón por su clave
  - `findCouponsByBusiness()` - Busca cupones por negocio

## Cómo Usar

### Importar tipos:
```typescript
import type { User } from '../modules/types/user';
import type { Coupon } from '../modules/types/coupon';
import type { Achievement } from '../modules/types/achievement';
```

### Obtener datos del usuario:
```typescript
import { getUserData, getUserPoints, getUserLevel } from '../modules/user/getUserData';

const user = await getUserData('userId123');
const points = await getUserPoints('userId123');
const level = await getUserLevel('userId123');
```

### Trabajar con cupones:
```typescript
import { getActiveCoupons, findCouponByKey, redeemCoupon } from '../modules/rewards/couponLogic';

const activeCoupons = getActiveCoupons(user.cupones);
const coupon = findCouponByKey(user.cupones, 'BELLA20ABC123');
const redeemedCoupon = redeemCoupon(coupon);
```

## Próximas Pasos

1. **Conectar con Firebase**: Una vez que la conexión a Firebase esté completamente configurada, descomentar las líneas en `getUserData.js` para obtener datos reales de la base de datos.

2. **Logros**: Cuando estés listo, crear funciones adicionales en `modules/rewards/achievementLogic.ts` para la gestión de logros.

3. **Actualizar datos**: Crear funciones para actualizar datos del usuario en la base de datos (actualizarPuntos, agregarCupón, desbloquearLogro, etc.).

4. **Validaciones**: Agregar más validaciones según sea necesario.
