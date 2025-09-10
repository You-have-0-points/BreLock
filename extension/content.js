(function() {
    'use strict';
// ---- styles ----
    function injectStyles() {
        const css = `
            :root {
              --text-primary: #000000;
              --input-border: #e6e8eb;
            }
            #cred-panel, #save-modal {
              font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }
            #cred-panel {
              position: fixed; top: 60px; right: 20px; width: 360px; max-height: 70vh; overflow-y: auto;
              background: white; border-radius: 12px; box-shadow: 0 12px 36px rgba(0,123,255,0.18);
              padding: 16px; z-index: 99999; color: var(--text-primary);
            }
            #cred-panel h2, #save-modal h3 {
              color: var(--text-primary); margin-bottom: 12px; font-weight: 600;
            }
            #cred-panel p {
              color: var(--text-primary);
            }
            #cred-panel-close {
              position: absolute; top: 12px; right: 12px; background: transparent; border: none;
              font-size: 28px; line-height: 1; cursor: pointer; color: #000; padding: 5px;
            }
            #cred-rows-container { display: flex; flex-direction: column; gap: 12px; }
            .cred-row {
              border-radius: 8px; background: #fbfbfd; border: 1px solid #f1f3f5; padding: 12px;
              box-shadow: 0 6px 18px rgba(16, 24, 40, 0.08); display: flex; flex-direction: column; gap: 8px;
            }
            .input {
              border: 2px solid var(--input-border); width: 100%; height: 44px; padding: 0 12px;
              outline: none; background-color: #ffffff; border-radius: 10px; font-size: 14px;
              color: var(--text-primary) !important; /* ВАЖНО: ЧЕРНЫЙ ТЕКСТ В ПОЛЯХ ВВОДА */
              box-sizing: border-box;
            }
            .input:focus { border-color: #4A9DEC; box-shadow: 0 0 0 4px rgba(74, 157, 236, 0.2); }
            .password-wrapper { position: relative; width: 100%; display: flex; align-items: center; }
            .toggle-password-btn {
              position: absolute; top: 50%; right: 1px; transform: translateY(-50%); background: transparent;
              border: none; cursor: pointer; font-size: 20px; padding: 0 12px; height: 90%; color: #333;
            }
            .cred-actions { display: flex; gap: 8px; margin-top: 8px; }
            .btn-primary, .btn-secondary {
              border-radius: 10px; padding: 10px 18px; font-size: 14px; font-weight: 600; cursor: pointer;
              border: none; display: inline-flex; align-items: center; justify-content: center; height: 44px;
            }
            .btn-primary { color: #fff; background-image: linear-gradient(to right, #25aae1, #4481eb, #04befe, #3f86ed); background-size: 300% 100%; }
            .btn-secondary {
              background: #fff; border: 1px solid #e6e8eb; box-shadow: 0 4px 10px rgba(16, 24, 40, 0.05);
              color: var(--text-primary) !important; /* ВАЖНО: ЧЕРНЫЙ ТЕКСТ В КНОПКАХ */
              flex-grow: 1;
            }
            #cred-open-save { width: 100%; margin-top: 16px; }
            #save-modal {
              position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px 25px;
              border-radius: 12px; box-shadow: 0 10px 30px rgba(0,123,255,0.2); z-index: 100000; min-width: 300px;
            }
            .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = css;
        document.head.appendChild(styleSheet);
    }

    // --- contentik ---
    const BASE_URL = 'https://askcfqmksmsgvvpmfhkt.supabase.co';
    const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFza2NmcW1rc21zZ3Z2cG1maGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzODg3NzMsImV4cCI6MjA2MTk2NDc3M30.eUbOzB6kdrCb9gUUK3tcXmXzfhaxt-OeScMyGJ5UJzU';

    function getServiceDomain() {
        const host = window.location.hostname;
        const parts = host.split('.');
        return parts.length > 2 ? parts.slice(-2).join('.') : host;
    }

    async function fetchCredentialsFor(domain) {
        try {
            const url = new URL(`${BASE_URL}/rest/v1/passwords`);
            url.searchParams.set('user_id', 'eq.1');
            url.searchParams.set('name_service', `eq.${domain}`);
            url.searchParams.set('select', 'id,login:user_login,encrypted_pass:encrypted_password');
            const res = await fetch(url.toString(), {
                method: 'GET',
                headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}`, 'Accept': 'application/json' }
            });
            if (!res.ok) return null;
            return await res.json() || [];
        } catch (err) {
            console.error('Fetch error:', err);
            return [];
        }
    }

    async function saveCredentials(login, password) {
        try {
            const response = await fetch(`${BASE_URL}/rest/v1/passwords`, {
                method: 'POST',
                headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: 1, name_service: getServiceDomain(), user_login: login,
                    encrypted_password: password, name_service_icon: getServiceDomain()
                })
            });
            if (response.status === 409) {
                alert('Такой логин уже существует!');
                return false;
            }
            return response.ok;
        } catch (error) {
            console.error('Save error:', error);
            return false;
        }
    }

    function createSaveModal() {
        const modal = document.createElement('div');
        modal.id = 'save-modal';
        modal.innerHTML = `
            <h3>Сохранить пароль для ${getServiceDomain()}?</h3>
            <input id="modal-login" class="input" placeholder="Логин" type="text" />
            <div class="password-wrapper" style="margin-top: 10px;">
                <input id="modal-password" class="input" placeholder="Пароль" type="password" />
                <button id="modal-toggle-password" class="toggle-password-btn" title="Показать/скрыть пароль">👁️</button>
            </div>
            <div class="modal-actions">
                <button id="modal-cancel" class="btn-secondary">Отмена</button>
                <button id="modal-save" class="btn-primary">Сохранить</button>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('#modal-cancel').addEventListener('click', () => modal.remove());
        modal.querySelector('#modal-toggle-password').addEventListener('click', (e) => {
            const passwordInput = modal.querySelector('#modal-password');
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            e.currentTarget.textContent = isPassword ? '🙈' : '👁️';
        });
        modal.querySelector('#modal-save').addEventListener('click', async () => {
            const login = modal.querySelector('#modal-login').value.trim();
            const password = modal.querySelector('#modal-password').value.trim();
            if (!login || !password) {
                alert('Пожалуйста, заполните оба поля');
                return;
            }
            if (await saveCredentials(login, password)) {
                alert('Данные успешно сохранены!');
                modal.remove();
                loadAndRenderCredentials();
            } else {
                alert('Ошибка при сохранении. Проверьте консоль.');
            }
        });
    }

    async function loadAndRenderCredentials() {
        const domain = getServiceDomain();
        let panel = document.getElementById('cred-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'cred-panel';
            document.body.appendChild(panel);
        }

        panel.innerHTML = `
            <button id="cred-panel-close" title="Закрыть">&times;</button>
            <h2>Пароли для ${domain}</h2>
            <div id="cred-rows-container"></div>
            <button id="cred-open-save" class="btn-primary">Сохранить новый</button>
        `;
        panel.querySelector('#cred-panel-close').addEventListener('click', () => panel.remove());
        panel.querySelector('#cred-open-save').addEventListener('click', createSaveModal);

        const container = panel.querySelector('#cred-rows-container');
        const creds = await fetchCredentialsFor(domain);

        if (!creds || creds.length === 0) {
            container.innerHTML = '<p>Нет сохранённых данных</p>';
        } else {
            creds.forEach(({ login, encrypted_pass }) => {
                const row = document.createElement('div');
                row.className = 'cred-row';
                row.innerHTML = `
                    <input class="input cred-login" value="${login}" readonly />
                    <div class="password-wrapper">
                        <input class="input cred-password" type="password" value="${encrypted_pass}" readonly />
                        <button class="toggle-password-btn" title="Показать/скрыть пароль">👁️</button>
                    </div>
                    <div class="cred-actions">
                        <button class="btn-secondary btn-fill">Заполнить</button>
                        <button class="btn-secondary btn-copy">Копировать</button>
                    </div>`;
                container.appendChild(row);

                row.querySelector('.toggle-password-btn').addEventListener('click', (e) => {
                    const passInput = row.querySelector('.cred-password');
                    const isPassword = passInput.type === 'password';
                    passInput.type = isPassword ? 'text' : 'password';
                    e.currentTarget.innerHTML = isPassword ? '🙈' : '👁️';
                });

                row.querySelector('.btn-fill').addEventListener('click', () => {
                    const loginField = document.querySelector('input[type="text"], input[type="email"]');
                    const passwordField = document.querySelector('input[type="password"]');
                    if (loginField) loginField.value = login;
                    if (passwordField) passwordField.value = encrypted_pass;
                    if(loginField || passwordField) alert('Поля формы заполнены!');
                });

                row.querySelector('.btn-copy').addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(encrypted_pass);
                        alert('Пароль скопирован');
                    } catch {
                        alert('Не удалось скопировать пароль');
                    }
                });
            });
        }
    }

    // --- start ---
    injectStyles();
    window.addEventListener('load', () => {
        if (document.querySelector('input[type="password"]')) {
            loadAndRenderCredentials();
        }
    });

})();