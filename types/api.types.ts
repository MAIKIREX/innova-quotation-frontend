// types/api.types.ts

/* =========================================
 * 🔐 AUTH / USERS
 * =======================================*/

export enum Role {
  ADMIN = "admin",
  USER = "user",
  SELLER = "seller",
}

/** Payload del JWT (no sale tal cual en Swagger, pero lo usamos en frontend) */
export interface JwtPayload {
  sub: string;        // user id
  role: Role | string;
}

/** Perfil (Profile) según Swagger */
export interface Profile {
  id: number;
  name: string;
  lastname: string;
  createdAt: string;
  updatedAt: string;
  // relación inversa con User, normalmente no la necesitas en frontend:
  user?: User;
}

/** Usuario según Swagger */
export interface User {
  id: string;
  email: string;
  // writeOnly en backend, por eso opcional en frontend
  password?: string;
  role: Role | string;
  createdAt: string;
  updatedAt: string;
  profile: Profile;
  quotations: Quotation[];
}

/** Usuario que realmente usamos tras login (sin password obligatorio) */
export type AuthUser = Omit<User, "password">;

/** Credenciales de login (Swagger en /auth/login) */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** Respuesta esperada del login (basado en tu controlador) */
export interface AuthResponse {
  user: AuthUser;
  access_token: string;
}

/** Estado de auth en el frontend (opcional) */
export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

/* =========================================
 * 🏢 COMPANIES
 * =======================================*/

export interface Company {
  id: string;
  name: string;
  nit?: string;
  address?: string;
  phone?: string;
  email?: string;
  city?: string;
  country?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
  quotations: Quotation[];
}

/** Basado en CreateCompanyDto */
export interface CreateCompanyPayload {
  name: string;
  nit?: string;
  address?: string;
  phone?: string;
  email?: string;
  city?: string;
  country?: string;
  logoUrl?: string;
}

/** Basado en UpdateCompanyDto (todos opcionales) */
export type UpdateCompanyPayload = Partial<CreateCompanyPayload>;

/* =========================================
 * 👥 CUSTOMERS
 * =======================================*/

export interface Customer {
  id: string;
  name: string;
  nitCi?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  quotations: Quotation[];
}

/** CreateCustomerDto */
export interface CreateCustomerPayload {
  name: string;
  nitCi?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

/** UpdateCustomerDto */
export type UpdateCustomerPayload = Partial<CreateCustomerPayload>;

/* =========================================
 * 📦 PRODUCTS
 * =======================================*/

export interface Product {
  id: string;
  name: string;
  description?: string;
  unit: string;
  // En la entidad vienen como string (numeric en DB)
  costReference?: string;
  priceReference?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  quotationItems: QuotationItem[];
}

/** CreateProductDto */
export interface CreateProductPayload {
  name: string;
  description?: string;
  unit?: string;
  costReference?: number;
  priceReference?: number;
  active?: boolean;
}

/** UpdateProductDto */
export type UpdateProductPayload = Partial<CreateProductPayload>;

/* =========================================
 * 📄 QUOTATIONS (Proformas)
 * =======================================*/

export type QuotationStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "rejected"
  | "cancelled"
  | string;

/** Ítem de proforma según entidad QuotationItem */
export interface QuotationItem {
  id: string;
  quotationId: string;
  quotation: Quotation;

  product?: Product;
  productId?: string;

  itemDescription: string;

  // En respuestas vienen como string
  quantity: string;
  costUnit: string;
  marginPercent: string;
  marginAmount: string;
  saleUnit: string;
  totalCost: string;
  totalSale: string;

  order: number;
  createdAt: string;
  updatedAt: string;
}

/** Payload para crear ítems (CreateQuotationItemDto) */
export interface CreateQuotationItemPayload {
  productId?: string;
  itemDescription: string;
  quantity: number;
  costUnit: number;
  marginPercent: number;
  marginAmount?: number;
  saleUnit?: number;
  totalCost?: number;
  totalSale?: number;
  order?: number;
}

/** PDF de proforma (QuotationPdf) */
export interface QuotationPdf {
  id: string;
  quotationId: string;
  quotation: Quotation;
  filePath: string;
  createdAt: string;
}

/** Envío de correo de proforma (QuotationEmail) */
export interface QuotationEmail {
  id: string;
  quotationId: string;
  quotation: Quotation;

  toEmail: string;
  subject: string;
  bodyPreview?: string;

  sentByUser?: User;
  sentByUserId?: string;

  sentAt: string;
  status: string; // "success" | "error" en la práctica
  errorDetail?: string;
}

/** Entidad principal de la proforma (Quotation) */
export interface Quotation {
  id: string;

  companyId: string;
  company: Company;

  customerId: string;
  customer: Customer;

  userId: string;
  user: User;

  number: string;
  issueDate: string;      // YYYY-MM-DD
  dueDate?: string;       // YYYY-MM-DD | null

  currency: string;       // default "BOB"

  subtotalAmount: string;
  discountAmount: string;
  taxIvaAmount: string;
  taxItAmount: string;
  totalAmount: string;

  totalCost: string;
  grossProfit: string;
  netProfit: string;
  globalMarginPercent?: string;

  status: QuotationStatus;

  notes?: string;
  warranty?: string;
  paymentTerms?: string;
  deliveryPlace?: string;

  createdAt: string;
  updatedAt: string;

  items: QuotationItem[];
  pdfFiles: QuotationPdf[];
  emails: QuotationEmail[];
}

/** CreateQuotationDto (adaptado: muchos campos opcionales en frontend) */
export interface CreateQuotationPayload {
  companyId: string;
  customerId: string;
  // Swagger lo define, pero en tu backend normalmente viene del token:
  userId?: string;

  number?: string;
  issueDate: string;
  dueDate?: string;

  currency: string;
  notes?: string;
  warranty?: string;
  paymentTerms?: string;
  deliveryPlace?: string;

  status?: QuotationStatus;

  // En Swagger están como number, pero el backend puede recalcularlos;
  // los dejamos opcionales para que no te obligue a enviarlos.
  subtotalAmount?: number;
  discountAmount?: number;
  taxIvaAmount?: number;
  taxItAmount?: number;
  totalAmount?: number;
  totalCost?: number;
  grossProfit?: number;
  netProfit?: number;
  globalMarginPercent?: number;

  items: CreateQuotationItemPayload[];
}

/** UpdateQuotationDto */
export type UpdateQuotationPayload = Partial<CreateQuotationPayload>;

/* =========================================
 * ✉️ Envío de email de proforma
 * =======================================*/

/** SendQuotationEmailDto */
export interface SendQuotationEmailPayload {
  toEmail: string;
  subject: string;
  body?: string;
}

/* =========================================
 * 👥 USERS (DTOs)
 * =======================================*/

/** CreateProfileDto */
export interface CreateProfilePayload {
  name: string;
  lastname: string;
}

/** UpdateProfileDto */
export type UpdateProfilePayload = Partial<CreateProfilePayload>;

/** CreateUserDto */
export interface CreateUserPayload {
  email: string;
  password: string;
  role?: Role; // Swagger lo define pero no es requerido
  profile: CreateProfilePayload;
}

/** UpdateUserDto */
export interface UpdateUserPayload {
  email?: string;
  password?: string;
  role?: Role;
  profile?: UpdateProfilePayload;
}

/* =========================================
 * 📚 Utilidades genéricas
 * =======================================*/

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
