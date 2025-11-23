// types/api.ts

// Tipos básicos útiles
export type Role = 'admin' | 'user' | 'seller';
export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'cancelled';

// ENTIDADES PRINCIPALES

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
  // relación inversa, la dejo opcional para evitar objetos enormes y recursivos
  quotations?: Quotation[];
}

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
  quotations?: Quotation[];
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  unit?: string;
  // en la entidad vienen como string (decimal), en los DTO como number
  costReference?: string;
  priceReference?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  quotationItems?: QuotationItem[];
}

export interface QuotationItem {
  id: string;
  quotation?: Quotation;   // relación inversa opcional
  quotationId: string;
  product?: Product;
  productId?: string;
  itemDescription: string;
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

export interface QuotationPdf {
  id: string;
  quotation?: Quotation;   // relación inversa opcional
  quotationId: string;
  filePath: string;
  createdAt: string;
}

export interface QuotationEmail {
  id: string;
  quotation?: Quotation;   // relación inversa opcional
  quotationId: string;
  toEmail: string;
  subject: string;
  bodyPreview?: string;
  sentByUser?: User;
  sentByUserId?: string;
  sentAt: string;
  status: string;
  errorDetail?: string;
}

export interface Quotation {
  id: string;
  company: Company;
  companyId: string;
  customer: Customer;
  customerId: string;
  user: User;
  userId: string;
  number: string;
  issueDate: string;
  dueDate?: string;
  currency: string;
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

export interface User {
  id: string;
  email: string;
  password?: string; // writeOnly, no debería venir desde la API
  role: Role;
  createdAt: string;
  updatedAt: string;
  profile: Profile;
  quotations?: Quotation[];
}

export interface Profile {
  id: number;
  name: string;
  lastname: string;
  createdAt: string;
  updatedAt: string;
  // relación inversa opcional para evitar recursión fuerte
  user?: User;
}

// DTOs

export interface CreateProfileDto {
  name: string;
  lastname: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  profile: CreateProfileDto;
  role?: Role;
}

export interface UpdateProfileDto {
  name?: string;
  lastname?: string;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  role?: Role;
  profile?: UpdateProfileDto;
}

export interface CreateCompanyDto {
  name: string;
  nit?: string;
  address?: string;
  phone?: string;
  email?: string;
  city?: string;
  country?: string;
  logoUrl?: string;
}

export interface UpdateCompanyDto {
  name?: string;
  nit?: string;
  address?: string;
  phone?: string;
  email?: string;
  city?: string;
  country?: string;
  logoUrl?: string;
}

export interface CreateCustomerDto {
  name: string;
  nitCi?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface UpdateCustomerDto {
  name?: string;
  nitCi?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  unit?: string;
  costReference?: number;
  priceReference?: number;
  active?: boolean;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  unit?: string;
  costReference?: number;
  priceReference?: number;
  active?: boolean;
}

export interface CreateQuotationItemDto {
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

export interface CreateQuotationDto {
  companyId: string;
  customerId: string;
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
  subtotalAmount?: number;
  discountAmount?: number;
  taxIvaAmount?: number;
  taxItAmount?: number;
  totalAmount?: number;
  totalCost?: number;
  grossProfit?: number;
  netProfit?: number;
  globalMarginPercent?: number;
  items: CreateQuotationItemDto[];
}

export interface UpdateQuotationDto {
  companyId?: string;
  customerId?: string;
  userId?: string;
  number?: string;
  issueDate?: string;
  dueDate?: string;
  currency?: string;
  notes?: string;
  warranty?: string;
  paymentTerms?: string;
  deliveryPlace?: string;
  status?: QuotationStatus;
  subtotalAmount?: number;
  discountAmount?: number;
  taxIvaAmount?: number;
  taxItAmount?: number;
  totalAmount?: number;
  totalCost?: number;
  grossProfit?: number;
  netProfit?: number;
  globalMarginPercent?: number;
  items?: CreateQuotationItemDto[];
}

export interface SendQuotationEmailDto {
  toEmail: string;
  subject: string;
  body?: string;
}

// LOGIN (auth)

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
}
