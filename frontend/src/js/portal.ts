interface LoginResponse {
  success: boolean;
  code: number;
  message: string;
  data?: {
    ReplyCode?: number;
    ReplyMessage?: string;
    [key: string]: unknown;
  };
}

interface WISPrParams {
  nbiIP: string | null;
  ueIP: string | null;
  ueMac: string | null;
  startUrl: string | null;
}

class WISPrPortal {
  private params: WISPrParams;
  private form: HTMLFormElement | null;
  private usernameInput: HTMLInputElement | null;
  private passwordInput: HTMLInputElement | null;
  private submitButton: HTMLInputElement | null;
  private resultElement: HTMLElement | null;

  constructor() {
    const urlParams = new URLSearchParams(window.location.search);

    this.params = {
      nbiIP: urlParams.get('nbiIP'),
      ueIP: urlParams.get('uip'),
      ueMac: urlParams.get('client_mac'),
      startUrl: urlParams.get('startUrl'),
    };

    this.form = document.getElementById('loginForm') as HTMLFormElement;
    this.usernameInput = document.getElementById('username') as HTMLInputElement;
    this.passwordInput = document.getElementById('password') as HTMLInputElement;
    this.submitButton = document.getElementById('login') as HTMLInputElement;
    this.resultElement = document.getElementById('result');

    this.init();
  }

  private init(): void {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Log params for debugging (remove in production)
    console.info('WISPr Portal initialized with params:', this.params);
  }

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();

    const username = this.usernameInput?.value.trim();
    const password = this.passwordInput?.value;

    if (!username || !password) {
      this.showMessage('Please enter username and password', 'error');
      return;
    }

    if (!this.params.nbiIP) {
      this.showMessage('Missing NBI IP parameter', 'error');
      return;
    }

    if (!this.params.ueIP || !this.params.ueMac) {
      this.showMessage('Missing client parameters', 'error');
      return;
    }

    await this.login(username, password);
  }

  private async login(username: string, password: string): Promise<void> {
    this.setLoading(true);
    this.clearMessage();

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          nbiIP: this.params.nbiIP,
          ueIP: this.params.ueIP,
          ueMac: this.params.ueMac,
        }),
      });

      const data: LoginResponse = await response.json();

      console.info('Login response:', data);

      // Check for successful login (NBI reply code 201)
      if (data.code === 201 || data.data?.ReplyCode === 201) {
        this.showMessage(data.data?.ReplyMessage || 'Login successful!', 'success');
        this.disableForm();
        this.redirectAfterDelay();
      } else {
        this.showMessage(
          data.data?.ReplyMessage || data.message || 'Login failed',
          'error'
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      this.showMessage('Connection error. Please try again.', 'error');
    } finally {
      this.setLoading(false);
    }
  }

  private showMessage(
    message: string,
    type: 'success' | 'error' | 'info' = 'info'
  ): void {
    if (this.resultElement) {
      this.resultElement.textContent = message;
      this.resultElement.className = `result-message ${type}`;
    }
  }

  private clearMessage(): void {
    if (this.resultElement) {
      this.resultElement.textContent = '';
      this.resultElement.className = 'result-message';
    }
  }

  private setLoading(loading: boolean): void {
    if (this.submitButton) {
      this.submitButton.disabled = loading;
      if (loading) {
        this.submitButton.classList.add('loading');
        this.submitButton.value = 'Logging in...';
      } else {
        this.submitButton.classList.remove('loading');
        this.submitButton.value = 'Log In';
      }
    }
  }

  private disableForm(): void {
    if (this.usernameInput) this.usernameInput.disabled = true;
    if (this.passwordInput) this.passwordInput.disabled = true;
    if (this.submitButton) {
      this.submitButton.disabled = true;
      this.submitButton.value = 'Redirecting...';
    }
  }

  private redirectAfterDelay(): void {
    const redirectUrl = this.params.startUrl || 'about:blank';

    this.showMessage(`Redirecting in 3 seconds...`, 'success');

    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 3000);
  }
}

// Initialize portal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new WISPrPortal();
});
