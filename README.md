# Teslo Shop

E-commerce full-stack construido con **Next.js 15 (App Router)**: catálogo con paginación, carrito persistente, checkout con dirección de envío, pago con **PayPal**, autenticación con roles y un panel de administración para gestionar productos, órdenes y usuarios.

> **Demo:**https://teslo-shop-beta-ten.vercel.app/
> **Credenciales demo:** usuario `melissa@google.com` / `123456` (rol usuario). El admin no es público.

## Funcionalidades

**Tienda**
- Catálogo por género (hombre, mujer, niños) con paginación en servidor y página de producto con galería (Swiper), selector de talla y control de stock.
- Carrito persistente en el cliente (Zustand + `localStorage`) agrupado por producto y talla, con resumen de artículos y total.
- Checkout con dirección de envío guardada por usuario y lista de países.
- Pago con PayPal: creación de la orden, verificación del pago en servidor contra la API de PayPal y marcado de la orden como pagada.
- Historial de órdenes del usuario y detalle de cada orden.

**Autenticación y autorización**
- Registro e inicio de sesión con Auth.js (NextAuth v5, credenciales) y contraseñas con hash `bcrypt`.
- Roles `admin` / `user`. Las rutas `/admin/*` se protegen en el middleware y cada acción de servidor o endpoint de escritura vuelve a comprobar sesión, rol y propiedad del recurso.

**Panel de administración**
- CRUD de productos con subida de imágenes a Cloudinary, borrado de imágenes, gestión de tallas, tags y stock.
- Listado paginado de todas las órdenes y de usuarios, con cambio de rol.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router, Server Components, Server Actions), React 19 |
| Lenguaje | TypeScript |
| Estilos / UI | Tailwind CSS 4, Radix UI, shadcn/ui, Lottie |
| Estado cliente | Zustand |
| Formularios y validación | React Hook Form + Zod |
| Base de datos | PostgreSQL en Supabase, acceso con Prisma ORM |
| Auth | Auth.js (NextAuth v5) + bcryptjs |
| Pagos | PayPal (`@paypal/react-paypal-js`) |
| Imágenes | Cloudinary |
| Despliegue | Vercel (región `cdg1`, París) + Supabase (`eu-west-3`, París) |

## Arquitectura

```
src/
├── app/            Rutas (App Router): (shop), auth, api
├── actions/        Server Actions por dominio (order, payments, product, user, address...)
├── components/     UI reutilizable (cart, product, checkout, ui...)
├── store/          Estado de cliente (Zustand): carrito, dirección, UI
├── lib/prisma.ts   Cliente Prisma (singleton)
├── auth.config.ts  Configuración de Auth.js
├── middleware.ts   Protección de /admin
└── seed/           Datos iniciales (productos, países, usuarios)
prisma/
├── schema.prisma   Modelo de datos (Product, Order, User, ...)
└── migrations/
```

Decisiones de diseño:
- **Lógica de negocio en Server Actions** y datos leídos en Server Components, de modo que el navegador no necesita endpoints REST para la mayor parte de la app.
- **Verificación del pago en servidor**: el cliente nunca decide si una orden está pagada; `paypalCheckPayment` consulta la API de PayPal y comprueba que la orden pertenezca al usuario autenticado.
- **Row Level Security activado** en todas las tablas de Supabase sin políticas públicas: la API REST de Supabase queda cerrada y solo Prisma (rol de servidor) accede a los datos.
- **Pooler + conexión directa**: la app usa el pooler transaccional (`DATABASE_URL`, puerto 6543) y Prisma Migrate usa `DIRECT_URL` (puerto 5432).

## Modelo de datos

`User` · `UserAddress` · `Country` · `Category` · `Product` · `ProductImage` · `Order` · `OrderItem` · `OrderAddress`, con enums `Size`, `Gender` y `Role`.

## Puesta en marcha en local

Requisitos: Node.js 20+ y una base de datos PostgreSQL (un proyecto de Supabase gratuito o Docker).

```bash
# 1. Dependencias (ejecuta también `prisma generate`)
npm install

# 2. Variables de entorno
cp .env.template .env      # rellena DATABASE_URL, DIRECT_URL, AUTH_SECRET, PayPal y Cloudinary

# 3. Base de datos
npx prisma migrate deploy  # aplica las migraciones
npm run seed               # carga productos, países y usuarios de ejemplo

# 4. Arrancar
npm run dev                # http://localhost:3000
```

**Base de datos local con Docker (opcional):** rellena `DB_USER`, `DB_NAME` y `DB_PASSWORD`, ejecuta `docker compose up -d` y usa la misma cadena para `DATABASE_URL` y `DIRECT_URL`:
`postgresql://DB_USER:DB_PASSWORD@localhost:5432/DB_NAME`.

**Seed:** crea el usuario admin `santiago@google.com` con la contraseña de `SEED_ADMIN_PASSWORD` (por defecto `123456`, solo para local) y el usuario `melissa@google.com`. El seed **borra los datos existentes**; sobre una base con `NODE_ENV=production` exige `ALLOW_SEED=true`.

### Variables de entorno

| Variable | Uso |
|---|---|
| `DATABASE_URL` | Conexión de la app (pooler de Supabase, `?pgbouncer=true`) |
| `DIRECT_URL` | Conexión para migraciones de Prisma |
| `AUTH_SECRET` | Secreto de Auth.js (`npx auth secret`) |
| `SEED_ADMIN_PASSWORD` | Contraseña del admin creado por el seed |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`, `PAYPAL_OAUTH_URL`, `PAYPAL_ORDERS_URL` | PayPal (sandbox por defecto) |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Subida de imágenes del admin |

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | `prisma generate` + build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | Comprobación de tipos con `tsc` |
| `npm run seed` | Carga los datos iniciales (borra los existentes) |

## Despliegue

1. Crear un proyecto en [Supabase](https://supabase.com) (región `eu-west-3`) y aplicar el esquema con `npx prisma migrate deploy`.
2. Importar el repositorio en [Vercel](https://vercel.com); `vercel.json` ya fija la región `cdg1` para estar junto a la base de datos.
3. Definir en Vercel todas las variables de la tabla anterior. Para PayPal en producción, sustituir las URLs sandbox por `https://api-m.paypal.com/v1/oauth2/token` y `https://api.paypal.com/v2/checkout/orders`, con las credenciales *live*.
4. Definir `AUTH_URL` con la URL pública si Auth.js no la detecta automáticamente.

## Estado y próximos pasos

- [ ] Tests (unitarios de las acciones de pedidos y E2E del flujo de compra con Playwright)
- [ ] Rate limiting en login y registro
- [ ] Emails transaccionales (confirmación de pedido)
- [ ] Comprobación del importe pagado en PayPal frente al total de la orden

## Créditos

Proyecto desarrollado a partir del curso de Next.js de Fernando Herrera, ampliado con control de acceso por rol, verificación de pago en servidor, base de datos gestionada en Supabase y despliegue en producción.
