// API Configuration
const BASE_URL = 'https://askcfqmksmsgvvpmfhkt.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFza2NmcW1rc21zZ3Z2cG1maGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzODg3NzMsImV4cCI6MjA2MTk2NDc3M30.eUbOzB6kdrCb9gUUK3tcXmXzfhaxt-OeScMyGJ5UJzU';

// Service Domain Parser
function getServiceDomain() {
    const host = window.location.hostname;
    const parts = host.split('.');
    return parts.length > 2 ? parts.slice(-2).join('.') : host;
}

// Fetch Credentials
async function fetchCredentialsFor(domain) {
    try {
        const url = new URL(`${BASE_URL}/rest/v1/passwords`);
        url.searchParams.set('user_id', 'eq.1');
        url.searchParams.set('name_service', `eq.${domain}`);
        url.searchParams.set('select', 'id,service_name:name_service,icon_name:name_service_icon,login:user_login,encrypted_pass:encrypted_password');

        const res = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'apikey': ANON_KEY,
                'Authorization': `Bearer ${ANON_KEY}`,
                'Accept': 'application/json'
            }
        });

        if (!res.ok) return null;
        const data = await res.json();
        return data?.[0] || null;
    } catch (err) {
        console.error('Fetch error:', err);
        return null;
    }
}

// Save Credentials
async function saveCredentials(login, password) {
    try {
        const response = await fetch(`${BASE_URL}/rest/v1/passwords`, {
            method: 'POST',
            headers: {
                'apikey': ANON_KEY,
                'Authorization': `Bearer ${ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                user_id: 1, // Замените на нужный user_id
                name_service: getServiceDomain(),
                user_login: login,
                encrypted_password: password,
                name_service_icon: getServiceDomain()
            })
        });
        return response.ok;
    } catch (error) {
        console.error('Save error:', error);
        return false;
    }
}

// Password Save Form
function createSaveForm(login, password) {
    const form = document.createElement('div');
    form.innerHTML = `
    <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
                background:#fff;padding:20px;border-radius:8px;box-shadow:0 0 15px rgba(0,0,0,0.2);z-index:9999">
      <h3 style="margin:0 0 15px 0;font-size:16px">Сохранить пароль для ${getServiceDomain()}?</h3>
      <input type="text" id="save-login" value="${login}" 
             style="display:block;width:100%;margin-bottom:10px;padding:8px">
      <input type="password" id="save-password" value="${password}" 
             style="display:block;width:100%;margin-bottom:15px;padding:8px">
      <div style="display:flex;gap:10px;justify-content:flex-end">
        <button id="cancel-btn" style="padding:6px 12px">Отмена</button>
        <button id="save-btn" style="padding:6px 12px;background:#4CAF50;color:white;border:none">Сохранить</button>
      </div>
    </div>
  `;
    return form;
}

// Event Handlers
document.addEventListener('click', async (event) => {
    // Auto-fill handler
    if (event.target.matches('input[type="text"], input[type="email"], input[type="password"]')) {
        const domain = getServiceDomain();
        const creds = await fetchCredentialsFor(domain);
        if (!creds) return;

        const loginField = document.querySelector('input[type="text"], input[type="email"]');
        const passwordField = document.querySelector('input[type="password"]');

        if (loginField) {
            loginField.value = creds.login;
            loginField.dispatchEvent(new Event('input', { bubbles: true }));
        }

        if (passwordField) {
            passwordField.value = creds.encrypted_pass;
            passwordField.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
});

document.addEventListener('input', (event) => {
    // Save form handler
    if (event.target.matches('input[type="password"]') && !document.getElementById('save-form')) {
        const loginField = document.querySelector('input[type="text"], input[type="email"]');
        const passwordField = event.target;

        if (loginField?.value && passwordField.value) {
            const form = createSaveForm(loginField.value, passwordField.value);
            form.id = 'save-form';

            form.querySelector('#save-btn').addEventListener('click', async () => {
                const login = form.querySelector('#save-login').value;
                const password = form.querySelector('#save-password').value;

                if (await saveCredentials(login, password)) {
                    alert('Данные успешно сохранены!');
                    form.remove();
                } else {
                    alert('Ошибка сохранения! Проверьте консоль.');
                }
            });

            form.querySelector('#cancel-btn').addEventListener('click', () => form.remove());

            document.body.appendChild(form);
        }
    }
});
