// API URL from environment variable (no hardcoded IPs)
// Default to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
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
      throw new Error(error.detail || 'Login failed');
    }

    const data: AuthResponse = await response.json();
    this.setToken(data.access_token);
    // Don't fetch user here - let handleLoginSuccess do it to avoid duplicate calls
    // The user will be fetched in handleLoginSuccess
    return data;
  }

  async register(data: RegisterData): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(error.detail || 'Registration failed');
    }

    return await response.json();
  }

  async fetchCurrentUser(retryCount: number = 0): Promise<User> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token available');
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Handle rate limiting (429) with retry
    if (response.status === 429 && retryCount < 2) {
      // Wait 1 second before retrying (exponential backoff)
      const delay = Math.pow(2, retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.fetchCurrentUser(retryCount + 1);
    }

    if (!response.ok) {
      // Don't logout on 429 errors - just throw
      if (response.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      }
      this.logout();
      throw new Error('Failed to fetch user');
    }

    const user: User = await response.json();
    this.setUser(user);
    return user;
  }

  // Alias for fetchCurrentUser (for backward compatibility)
  // Checks cache first, then fetches if needed
  async getCurrentUser(forceRefresh: boolean = false): Promise<User> {
    // If we have a cached user and not forcing refresh, return it
    if (!forceRefresh) {
      const cachedUser = this.getUser();
      if (cachedUser) {
        // Still fetch in background to ensure data is fresh, but return cached immediately
        this.fetchCurrentUser().catch(err => {
          console.warn('Background user fetch failed:', err);
        });
        return cachedUser;
      }
    }
    // No cache or force refresh - fetch from API
    return this.fetchCurrentUser();
  }

  async googleLogin(credential: string): Promise<AuthResponse> {
    if (!credential) {
      throw new Error('Google credential is missing');
    }
    
    const requestBody = { token: credential };
    console.log('Google login request:', { hasToken: !!credential, tokenLength: credential.length });
    
    const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorMessage = 'Google login failed';
      try {
        const error = await response.json();
        // Handle FastAPI validation errors (422)
        if (error.detail) {
          if (Array.isArray(error.detail)) {
            // Validation errors come as an array
            errorMessage = error.detail.map((e: any) => `${e.loc?.join('.')}: ${e.msg}`).join(', ');
          } else if (typeof error.detail === 'string') {
            errorMessage = error.detail;
          } else {
            errorMessage = JSON.stringify(error.detail);
          }
        } else if (error.message) {
          errorMessage = error.message;
        } else {
          errorMessage = JSON.stringify(error);
        }
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data: AuthResponse = await response.json();
    this.setToken(data.access_token);
    // Don't fetch user here - let handleLoginSuccess do it to avoid duplicate calls
    return data;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
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

  setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
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

