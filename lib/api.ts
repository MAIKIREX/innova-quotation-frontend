import type {
  CreateCompanyPayload,
  CreateCustomerPayload,
  CreateProductPayload,
  CreateQuotationPayload,
  SendQuotationEmailPayload,
  UpdateCompanyPayload,
  UpdateCustomerPayload,
  UpdateProductPayload,
  UpdateQuotationPayload,
} from "@/types/api.types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api"

const getAuthToken = (explicitToken?: string) => {
  if (explicitToken) return explicitToken
  if (typeof document === "undefined") return null
  const match = document.cookie.match(/(?:^|; )auth_token=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

const withAuth = (token: string | undefined, headers: HeadersInit = {}) => {
  const authToken = getAuthToken(token)
  if (!authToken) {
    throw new Error("No hay sesión activa")
  }
  return {
    ...headers,
    Authorization: `Bearer ${authToken}`,
  }
}

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  async register(email: string, password: string, name: string, lastname: string) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, profile: { name, lastname } }),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  // Quotations
  async getQuotations(token: string) {
    const res = await fetch(`${API_BASE_URL}/quotations`, { headers: withAuth(token) })
    if (!res.ok) throw new Error("Error fetching quotations")
    return res.json()
  },

  async getQuotation(id: string, token: string) {
    const res = await fetch(`${API_BASE_URL}/quotations/${id}`, { headers: withAuth(token) })
    if (!res.ok) throw new Error("Error fetching quotation")
    return res.json()
  },

  async downloadQuotationPdf(id: string, token: string): Promise<Blob> {
    const res = await fetch(`${API_BASE_URL}/quotations/${id}/pdf`, { headers: withAuth(token) })
    if (!res.ok) throw new Error("Error downloading PDF")
    return res.blob()
  },

  async generateQuotationPdf(id: string, token: string) {
    const res = await fetch(`${API_BASE_URL}/quotations/${id}/pdf`, {
      method: "POST",
      headers: withAuth(token),
    })
    if (!res.ok) throw new Error("Error generating PDF")
    return res.json()
  },

  async sendQuotationEmail(id: string, payload: SendQuotationEmailPayload, token: string) {
    const res = await fetch(`${API_BASE_URL}/quotations/${id}/send-email`, {
      method: "POST",
      headers: withAuth(token, { "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error("Error sending email")
    return res.json()
  },

  async createQuotation(data: CreateQuotationPayload, token: string) {
    const res = await fetch(`${API_BASE_URL}/quotations`, {
      method: "POST",
      headers: withAuth(token, { "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  async updateQuotation(id: string, data: UpdateQuotationPayload, token: string) {
    const res = await fetch(`${API_BASE_URL}/quotations/${id}`, {
      method: "PATCH",
      headers: withAuth(token, { "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  // Customers
  async getCustomers(token: string) {
    const res = await fetch(`${API_BASE_URL}/customers`, { headers: withAuth(token) })
    if (!res.ok) throw new Error("Error fetching customers")
    return res.json()
  },

  async getCustomer(id: string, token: string) {
    const res = await fetch(`${API_BASE_URL}/customers/${id}`, { headers: withAuth(token) })
    if (!res.ok) throw new Error("Error fetching customer")
    return res.json()
  },

  async createCustomer(data: CreateCustomerPayload, token: string) {
    const res = await fetch(`${API_BASE_URL}/customers`, {
      method: "POST",
      headers: withAuth(token, { "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  async updateCustomer(id: string, data: UpdateCustomerPayload, token: string) {
    const res = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "PATCH",
      headers: withAuth(token, { "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  // Products
  async getProducts(token: string) {
    const res = await fetch(`${API_BASE_URL}/products`, { headers: withAuth(token) })
    if (!res.ok) throw new Error("Error fetching products")
    return res.json()
  },

  async createProduct(data: CreateProductPayload, token: string) {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: withAuth(token, { "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  async getProduct(id: string, token: string) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, { headers: withAuth(token) })
    if (!res.ok) throw new Error("Error fetching product")
    return res.json()
  },

  async updateProduct(id: string, data: UpdateProductPayload, token: string) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PATCH",
      headers: withAuth(token, { "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  // Companies
  async getCompanies(token: string) {
    const res = await fetch(`${API_BASE_URL}/companies`, { headers: withAuth(token) })
    if (!res.ok) throw new Error("Error fetching companies")
    return res.json()
  },

  async getCompany(id: string, token: string) {
    const res = await fetch(`${API_BASE_URL}/companies/${id}`, { headers: withAuth(token) })
    if (!res.ok) throw new Error("Error fetching company")
    return res.json()
  },

  async createCompany(data: CreateCompanyPayload, token: string) {
    const res = await fetch(`${API_BASE_URL}/companies`, {
      method: "POST",
      headers: withAuth(token, { "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  async updateCompany(id: string, data: UpdateCompanyPayload, token: string) {
    const res = await fetch(`${API_BASE_URL}/companies/${id}`, {
      method: "PATCH",
      headers: withAuth(token, { "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  async deleteCompany(id: string, token: string) {
    const res = await fetch(`${API_BASE_URL}/companies/${id}`, {
      method: "DELETE",
      headers: withAuth(token),
    })
    if (!res.ok) throw new Error(await res.text())
    const text = await res.text()
    return text ? JSON.parse(text) : null
  },
}
