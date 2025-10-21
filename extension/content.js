// API Configuration
const BASE_URL = 'https://askcfqmksmsgvvpmfhkt.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFza2NmcW1rc21zZ3Z2cG1maGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzODg3NzMsImV4cCI6MjA2MTk2NDc3M30.eUbOzB6kdrCb9gUUK3tcXmXzfhaxt-OeScMyGJ5UJzU';

(function () {
    'use strict';

    // ---- styles ----
    function injectStyles() {
        const css = `
            :root {
              --text-primary: #000000;
              --input-border: #e6e8eb;
            }
            #cred-panel, #save-modal, #auth-form-container, #extension-icon {
              font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }
            #extension-icon {
              position: fixed;
              top: 20px;
              right: 20px;
              width: 40px;
              height: 40px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 18px;
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              z-index: 10000;
              border: 2px solid white;
              user-select: none;
              transition: all 0.3s ease;
            }
            #extension-icon:hover {
              transform: scale(1.1);
              box-shadow: 0 6px 20px rgba(0,0,0,0.2);
            }
            #cred-panel {
              position: fixed; top: 70px; right: 20px; width: 360px; max-height: 70vh; overflow-y: auto;
              background: white; border-radius: 12px; box-shadow: 0 12px 36px rgba(0,123,255,0.18);
              padding: 16px; z-index: 99999; color: var(--text-primary);
              display: none;
            }
            #cred-panel.visible {
              display: block;
            }
            #cred-panel h2, #save-modal h3, #auth-form-container h3 {
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
              color: var(--text-primary) !important;
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
            .btn-primary { 
              color: #fff; 
              background-image: linear-gradient(to right, #25aae1, #4481eb, #04befe, #3f86ed); 
              background-size: 300% 100%; 
            }
            .btn-primary:hover {
              background-position: 100% 0;
              transition: all .4s ease-in-out;
            }
            .btn-secondary {
              background: #fff; border: 1px solid #e6e8eb; box-shadow: 0 4px 10px rgba(16, 24, 40, 0.05);
              color: var(--text-primary) !important;
              flex-grow: 1;
            }
            .btn-secondary:hover {
              background: #f8f9fa;
            }
            #cred-open-save { width: 100%; margin-top: 16px; }
            #save-modal {
              position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
              background: white; padding: 20px 25px;
              border-radius: 12px; box-shadow: 0 10px 30px rgba(0,123,255,0.2); z-index: 100000; 
              min-width: 300px;
            }
            .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }

            /* Auth Form Styles */
            #auth-form-overlay {
              position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:center;
            }
            #auth-form-container {
              background:#fff;padding:25px;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,0.3);width:320px;
            }
            #auth-form-container input {
              width:calc(100% - 22px);padding:10px;margin-bottom:12px;border:1px solid #ccc;border-radius:4px;font-size:14px;
            }
            #auth-form-container .auth-actions {
              display:flex;gap:10px;margin-top:15px;
            }
            #auth-form-container .auth-actions button {
              flex:1;padding:10px;border:none;border-radius:4px;font-size:15px;cursor:pointer;
            }
            #login-btn { background:#2196F3;color:white; }
            #register-btn { background:#4CAF50;color:white; }
            #auth-error { color:red;margin-top:10px;text-align:center;display:none;font-size:13px; }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = css;
        document.head.appendChild(styleSheet);
    }

    // === Валидация входных данных ===
    function validateInput(input, fieldName = 'поле') {
        if (typeof input !== 'string') {
            throw new Error(`${fieldName} должно быть строкой`);
        }

        // Проверка длины
        if (input.length > 500) {
            throw new Error(`${fieldName} слишком длинное (макс. 500 символов)`);
        }

        if (input.length === 0) {
            throw new Error(`${fieldName} не может быть пустым`);
        }

        // Запрещенные SQL-команды и опасные паттерны
        const dangerousPatterns = [
            /\bdrop\s+database\b/i,
            /\bdelete\s+from\b/i,
            /\bupdate\s+.+\s+set\b/i,
            /\binsert\s+into\b/i,
            /\bselect\s+.+\bfrom\b/i,
            /\bunion\s+select\b/i,
            /\bexec(\s|\()+/i,
            /\bxp_/i,
            /(\;|\-\-|\#)/, // SQL инъекции
            /(\<\s*script)/i, // XSS
            /javascript\:/i, // XSS
            /on\w+\s*=/, // XSS события
        ];

        for (const pattern of dangerousPatterns) {
            if (pattern.test(input)) {
                throw new Error(`${fieldName} содержит запрещенные символы или команды`);
            }
        }

        return input.trim();
    }

    function sanitizeLogin(login) {
        return validateInput(login, 'Логин')
            .replace(/[<>]/g, ''); // Дополнительная очистка для HTML
    }

    function sanitizePassword(password) {
        return validateInput(password, 'Пароль');
    }

    // Service Domain Parser
    function getServiceDomain() {
        const host = window.location.hostname;
        const parts = host.split('.');
        return parts.length > 2 ? parts.slice(-2).join('.') : host;
    }

    // === Криптография ===
    async function sha256(str) {
        const buf = new TextEncoder().encode(str);
        const hash = await crypto.subtle.digest('SHA-256', buf);
        return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // === Иконка расширения ===
    function createExtensionIcon() {
        const existingIcon = document.getElementById('extension-icon');
        if (existingIcon) existingIcon.remove();

        const icon = document.createElement('div');
        icon.id = 'extension-icon';
        icon.innerHTML = '🔐';
        icon.title = 'Менеджер паролей - нажмите для открытия';

        document.body.appendChild(icon);

        icon.addEventListener('click', async (e) => {
            e.stopPropagation();
            await handleExtensionClick();
        });

        return icon;
    }

    // === Обработчик клика на иконку ===
    async function handleExtensionClick() {
        const { user_id, master_password } = await chrome.storage.local.get(['user_id', 'master_password']);

        if (!user_id || !master_password) {
            showAuthForm();
        } else {
            togglePasswordPanel();
        }
    }

    // === Переключение панели паролей ===
    function togglePasswordPanel() {
        let panel = document.getElementById('cred-panel');

        if (!panel) {
            createPasswordPanel();
            panel = document.getElementById('cred-panel');
        }

        if (panel.classList.contains('visible')) {
            panel.classList.remove('visible');
        } else {
            panel.classList.add('visible');
            loadAndRenderCredentials();
        }
    }

    // === Форма авторизации ===
    function showAuthForm() {
        if (document.getElementById('auth-form-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'auth-form-overlay';
        overlay.innerHTML = `
            <div id="auth-form-container">
                <h3 style="margin:0 0 20px;text-align:center;">Менеджер паролей</h3>
                <input type="email" id="auth-email" placeholder="Email" maxlength="100" />
                <input type="password" id="auth-master" placeholder="Мастер-пароль" maxlength="100" />
                <div class="auth-actions">
                    <button id="login-btn">Войти</button>
                    <button id="register-btn">Регистрация</button>
                </div>
                <p id="auth-error"></p>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector('#login-btn').addEventListener('click', handleLogin);
        overlay.querySelector('#register-btn').addEventListener('click', handleRegister);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    async function handleLogin() {
        const email = document.getElementById('auth-email').value.trim();
        const master = document.getElementById('auth-master').value;
        const errorEl = document.getElementById('auth-error');

        errorEl.style.display = 'none';

        try {
            if (!email || !master) {
                throw new Error('Заполните все поля');
            }

            if (!email.includes('@') || email.length < 3) {
                throw new Error('Введите корректный email');
            }

            // Валидация мастер-пароля
            validateInput(master, 'Мастер-пароль');

            const res = await fetch(`${BASE_URL}/rest/v1/rpc/get_hash_by_email`, {
                method: 'POST',
                headers: { 'apikey': ANON_KEY, 'Content-Type': 'application/json' },
                body: JSON.stringify({ p_email: email })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Пользователь не найден или ошибка сервера');
            }

            const serverHash = await res.text().then(t => t.trim().replace(/"/g, ''));
            const localHash = await sha256(master);

            if (serverHash !== localHash) {
                throw new Error('Неверный мастер-пароль');
            }

            const uidRes = await fetch(`${BASE_URL}/rest/v1/rpc/get_uid_by_email`, {
                method: 'POST',
                headers: { 'apikey': ANON_KEY, 'Content-Type': 'application/json' },
                body: JSON.stringify({ p_email: email })
            });
            const uid = await uidRes.text().then(t => parseInt(t.trim().replace(/"/g, '')));

            await chrome.storage.local.set({ user_id: uid, master_password: master, email });

            document.getElementById('auth-form-overlay')?.remove();
            togglePasswordPanel();
        } catch (err) {
            console.error('Login error:', err);
            errorEl.textContent = err.message || 'Ошибка входа';
            errorEl.style.display = 'block';
        }
    }

    async function handleRegister() {
        const email = document.getElementById('auth-email').value.trim();
        const master = document.getElementById('auth-master').value;
        const errorEl = document.getElementById('auth-error');

        errorEl.style.display = 'none';

        try {
            if (!email || !master) {
                throw new Error('Заполните все поля');
            }

            if (!email.includes('@') || email.length < 3) {
                throw new Error('Введите корректный email');
            }

            // Валидация мастер-пароля
            validateInput(master, 'Мастер-пароль');

            const keyPair = await crypto.subtle.generateKey(
                { name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
                true,
                ["encrypt", "decrypt"]
            );
            const publicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
            const privateKey = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

            const arrayBufferToBase64 = (buffer) => {
                let binary = '';
                const bytes = new Uint8Array(buffer);
                const len = bytes.byteLength;
                for (let i = 0; i < len; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                return btoa(binary);
            };

            const pubB64 = arrayBufferToBase64(publicKey);
            const privB64 = arrayBufferToBase64(privateKey);

            const masterHash = await sha256(master);

            const res = await fetch(`${BASE_URL}/rest/v1/rpc/add_user`, {
                method: 'POST',
                headers: { 'apikey': ANON_KEY, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    p_email: email,
                    p_master_key_hash: masterHash,
                    p_public_key: pubB64,
                    p_private_key: privB64
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Ошибка регистрации');
            }

            const uid = await res.text().then(t => parseInt(t.trim().replace(/"/g, '')));

            await chrome.storage.local.set({ user_id: uid, master_password: master, email });

            document.getElementById('auth-form-overlay')?.remove();
            togglePasswordPanel();
        } catch (err) {
            console.error('Register error:', err);
            errorEl.textContent = err.message || 'Ошибка регистрации';
            errorEl.style.display = 'block';
        }
    }

    // === Создание панели паролей ===
    function createPasswordPanel() {
        const panel = document.createElement('div');
        panel.id = 'cred-panel';
        panel.innerHTML = `
            <button id="cred-panel-close" title="Закрыть">&times;</button>
            <h2>Пароли для ${getServiceDomain()}</h2>
            <div id="cred-rows-container"></div>
            <button id="cred-open-save" class="btn-primary">Сохранить новый</button>
            <div style="margin-top: 12px; text-align: center;">
                <button id="cred-logout" class="btn-secondary" style="font-size: 12px; padding: 6px 12px;">Выйти</button>
            </div>
        `;
        document.body.appendChild(panel);

        panel.querySelector('#cred-panel-close').addEventListener('click', () => {
            panel.classList.remove('visible');
        });

        panel.querySelector('#cred-open-save').addEventListener('click', (e) => {
            e.stopPropagation();
            createSaveModal();
        });

        panel.querySelector('#cred-logout').addEventListener('click', async () => {
            await chrome.storage.local.clear();
            panel.classList.remove('visible');
            alert('Вы вышли из системы');
        });

        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && e.target.id !== 'extension-icon') {
                panel.classList.remove('visible');
            }
        });

        return panel;
    }

    // === Работа с паролями (через RPC) ===
    async function fetchCredentialsFor(domain) {
        try {
            const { user_id } = await chrome.storage.local.get('user_id');
            if (!user_id) {
                console.warn('User ID not found, cannot fetch credentials.');
                return [];
            }

            const res = await fetch(`${BASE_URL}/rest/v1/rpc/get_password_by_user_and_service`, {
                method: 'POST',
                headers: {
                    'apikey': ANON_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    p_user_id: user_id,
                    p_service_name: domain
                })
            });

            if (!res.ok) {
                console.error('Failed to fetch credentials:', res.status, res.statusText);
                return [];
            }

            const data = await res.json();

            if (!data || data.length === 0) {
                return [];
            }

            return data.map(item => {
                return {
                    user_login: item.login || '',
                    encrypted_password: item.encrypted_pass || ''
                };
            });
        } catch (err) {
            console.error('Fetch credentials error:', err);
            return [];
        }
    }

    async function saveCredentials(login, password) {
        try {
            // Валидация входных данных
            const sanitizedLogin = sanitizeLogin(login);
            const sanitizedPassword = sanitizePassword(password);

            const { user_id } = await chrome.storage.local.get('user_id');
            if (!user_id) {
                console.error('Cannot save credentials: User ID not available.');
                alert('Ошибка сохранения: Вы не авторизованы. Войдите в менеджер паролей.');
                return false;
            }

            const res = await fetch(`${BASE_URL}/rest/v1/rpc/add_password_by_uid_service_enc_pass`, {
                method: 'POST',
                headers: {
                    'apikey': ANON_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    p_user_id: user_id,
                    p_name_service: getServiceDomain(),
                    p_user_login: sanitizedLogin,
                    p_encrypted_password: sanitizedPassword
                })
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('Supabase save error:', errorText);

                let errorMessage = 'Неизвестная ошибка Supabase';
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || errorMessage;
                } catch {
                    errorMessage = errorText || `HTTP error ${res.status}`;
                }

                alert(`Ошибка сохранения: ${errorMessage}`);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Save error:', error);
            alert(`Ошибка сохранения: ${error.message}`);
            return false;
        }
    }

    // UI: форма сохранения пароля
    function createSaveModal(initialLogin = '', initialPassword = '') {
        const existingModal = document.getElementById('save-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'save-modal';
        modal.innerHTML = `
            <h3>Сохранить пароль для ${getServiceDomain()}?</h3>
            <input id="modal-login" class="input" placeholder="Логин" type="text" value="${initialLogin}" maxlength="100" />
            <div class="password-wrapper" style="margin-top: 10px;">
                <input id="modal-password" class="input" placeholder="Пароль" type="password" value="${initialPassword}" maxlength="500" />
                <button id="modal-toggle-password" class="toggle-password-btn" title="Показать/скрыть пароль">👁️</button>
            </div>
            <div class="modal-actions">
                <button id="modal-cancel" class="btn-secondary">Отмена</button>
                <button id="modal-save" class="btn-primary">Сохранить</button>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('#modal-cancel').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('#modal-toggle-password').addEventListener('click', (e) => {
            const passwordInput = modal.querySelector('#modal-password');
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            e.currentTarget.textContent = isPassword ? '🙈' : '👁️';
        });

        modal.querySelector('#modal-save').addEventListener('click', async () => {
            const login = modal.querySelector('#modal-login').value;
            const password = modal.querySelector('#modal-password').value;

            try {
                if (!login || !password) {
                    throw new Error('Пожалуйста, заполните оба поля');
                }

                if (await saveCredentials(login, password)) {
                    alert('Данные успешно сохранены!');
                    modal.remove();
                    loadAndRenderCredentials();
                }
            } catch (error) {
                alert(`Ошибка: ${error.message}`);
            }
        });

        const closeModalOnOutsideClick = (e) => {
            if (!modal.contains(e.target)) {
                modal.remove();
                document.removeEventListener('click', closeModalOnOutsideClick);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', closeModalOnOutsideClick);
        }, 100);

        setTimeout(() => {
            const loginInput = modal.querySelector('#modal-login');
            if (loginInput) loginInput.focus();
        }, 50);
    }

    // UI: Загрузка и отображение паролей
    async function loadAndRenderCredentials() {
        const domain = getServiceDomain();
        const creds = await fetchCredentialsFor(domain);

        const container = document.getElementById('cred-rows-container');
        if (!container) return;

        if (!creds || creds.length === 0) {
            container.innerHTML = '<p>Нет сохранённых данных</p>';
        } else {
            container.innerHTML = '';

            creds.forEach((cred) => {
                const login = cred.user_login || '';
                const password = cred.encrypted_password || '';

                const row = document.createElement('div');
                row.className = 'cred-row';

                // Поле логина
                const loginInput = document.createElement('input');
                loginInput.className = 'input cred-login';
                loginInput.type = 'text';
                loginInput.value = login;
                loginInput.readOnly = true;

                // Обертка для пароля
                const passwordWrapper = document.createElement('div');
                passwordWrapper.className = 'password-wrapper';

                const passwordInput = document.createElement('input');
                passwordInput.className = 'input cred-password';
                passwordInput.type = 'password';
                passwordInput.value = password;
                passwordInput.readOnly = true;

                const toggleBtn = document.createElement('button');
                toggleBtn.className = 'toggle-password-btn';
                toggleBtn.title = 'Показать/скрыть пароль';
                toggleBtn.textContent = '👁️';

                passwordWrapper.appendChild(passwordInput);
                passwordWrapper.appendChild(toggleBtn);

                // Кнопки действий
                const actions = document.createElement('div');
                actions.className = 'cred-actions';

                const fillBtn = document.createElement('button');
                fillBtn.className = 'btn-secondary btn-fill';
                fillBtn.textContent = 'Заполнить';

                const copyBtn = document.createElement('button');
                copyBtn.className = 'btn-secondary btn-copy';
                copyBtn.textContent = 'Копировать';

                actions.appendChild(fillBtn);
                actions.appendChild(copyBtn);

                // Собираем все вместе
                row.appendChild(loginInput);
                row.appendChild(passwordWrapper);
                row.appendChild(actions);

                container.appendChild(row);

                // Обработчики событий
                toggleBtn.addEventListener('click', (e) => {
                    const isPassword = passwordInput.type === 'password';
                    passwordInput.type = isPassword ? 'text' : 'password';
                    e.currentTarget.textContent = isPassword ? '🙈' : '👁️';
                });

                fillBtn.addEventListener('click', () => {
                    const loginField = document.querySelector('input[type="text"], input[type="email"]');
                    const passwordField = document.querySelector('input[type="password"]');

                    if (loginField) {
                        loginField.value = login;
                        loginField.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    if (passwordField) {
                        passwordField.value = password;
                        passwordField.dispatchEvent(new Event('input', { bubbles: true }));
                    }

                    if (loginField || passwordField) {
                        alert('Поля формы заполнены!');
                    }
                    document.getElementById('cred-panel').classList.remove('visible');
                });

                copyBtn.addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(password);
                        alert('Пароль скопирован');
                    } catch {
                        alert('Не удалось скопировать пароль');
                    }
                });
            });
        }
    }

    // === Автозаполнение при клике на поля (только для авторизованных) ===
    function initAutoFill() {
        document.addEventListener('click', async (event) => {
            if (event.target.matches('input[type="text"], input[type="email"], input[type="password"]')) {
                const { user_id } = await chrome.storage.local.get('user_id');
                if (!user_id) return;

                const domain = getServiceDomain();
                const creds = await fetchCredentialsFor(domain);

                if (creds && creds.length === 1) {
                    const { user_login: login, encrypted_password: encrypted_pass } = creds[0];

                    const loginFields = document.querySelectorAll('input[type="text"], input[type="email"]');
                    const passwordFields = document.querySelectorAll('input[type="password"]');

                    if (loginFields.length > 0) {
                        loginFields[0].value = login;
                        loginFields[0].dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    if (passwordFields.length > 0) {
                        passwordFields[0].value = encrypted_pass;
                        passwordFields[0].dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }
            }
        });
    }

    // === Инициализация расширения ===
    async function initExtension() {
        injectStyles();
        createExtensionIcon();

        const { user_id } = await chrome.storage.local.get('user_id');
        if (user_id) {
            initAutoFill();
        }
    }

    // Запуск расширения
    if (typeof chrome !== 'undefined' && chrome.storage) {
        initExtension();
    }
})();
