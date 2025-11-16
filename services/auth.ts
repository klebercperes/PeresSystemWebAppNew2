// Auth service for FastAPI integration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://10.0.1.122:8000';

export interface LoginCredentials {
  username: string; // FastAPI uses 'username' field
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  is_superuser?: boolean;
  role?: string;
  email_verified?: boolean;
}

class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(error.detail || `Login failed: ${response.status}`);
    }

    const data: AuthResponse = await response.json();
    this.setToken(data.access_token);
    return data;
  }

  async register(data: { username: string; email: string; password: string; full_name?: string }): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        role: 'customer',  // Signups are always customers
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(error.detail || 'Registration failed');
    }

    const user: User = await response.json();
    this.setUser(user);
    return user;
  }

  async googleLogin(googleToken: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: googleToken }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Google login failed' }));
      throw new Error(error.detail || `Google login failed: ${response.status}`);
    }

    const data: AuthResponse = await response.json();
    this.setToken(data.access_token);
    return data;
  }

  async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      // Don't add query parameter for cache-busting - it causes CORS preflight
      // Rely on Cache-Control headers instead
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
          return null;
        }
        // Handle rate limiting (429) - don't throw, just return null to avoid breaking the app
        if (response.status === 429) {
          // Rate limited - return cached user if available
          return this.getUser();
        }
        throw new Error('Failed to get user');
      }

      const user: User = await response.json();
      this.setUser(user);
      return user;
    } catch (error) {
      // Silently handle errors - return cached user if available
      return this.getUser();
    }
  }

  // Alias for getCurrentUser (some code uses fetchCurrentUser)
  async fetchCurrentUser(): Promise<User | null> {
    return this.getCurrentUser();
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getAuthHeader(): { Authorization: string } | {} {
    const token = this.getToken();
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }
}

export const authService = new AuthService();

