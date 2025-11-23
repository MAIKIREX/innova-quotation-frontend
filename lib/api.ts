const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

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
    const res = await fetch(`${API_BASE_URL}/quotations`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error("Error fetching quotations")
    return res.json()
  },

  async getQuotation(id: string, token: string) {
    const res = await fetch(`${API_BASE_URL}/quotations/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error("Error fetching quotation")
    return res.json()
  },

  async createQuotation(data: any, token: string) {
    const res = await fetch(`${API_BASE_URL}/quotations`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  // Customers
  async getCustomers(token: string) {
    const res = await fetch(`${API_BASE_URL}/customers`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error("Error fetching customers")
    return res.json()
  },

  async createCustomer(data: any, token: string) {
    const res = await fetch(`${API_BASE_URL}/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  // Products
  async getProducts(token: string) {
    const res = await fetch(`${API_BASE_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error("Error fetching products")
    return res.json()
  },

  async createProduct(data: any, token: string) {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  // Companies
  async getCompanies(token: string) {
    const res = await fetch(`${API_BASE_URL}/companies`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error("Error fetching companies")
    return res.json()
  },
}
