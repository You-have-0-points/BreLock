// API //
const BASE_URL = 'https://askcfqmksmsgvvpmfhkt.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFza2NmcW1rc21zZ3Z2cG1maGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzODg3NzMsImV4cCI6MjA2MTk2NDc3M30.eUbOzB6kdrCb9gUUK3tcXmXzfhaxt-OeScMyGJ5UJzU';

// Парсим сервис //
function getServiceDomain() {
  const host = window.location.hostname;
  const parts = host.split('.');
  return parts.length > 2
    ? parts.slice(-2).join('.')
    : host;
}

// GET запрос для user_id = 1 //
async function fetchCredentialsFor(domain) {
  try {
    const url = new URL(`${BASE_URL}/rest/v1/passwords`);

    url.searchParams.set('user_id', 'eq.1');
    url.searchParams.set('name_service', `eq.${domain}`);
    url.searchParams.set('select',
      'id,' +
      'service_name:name_service,' +
      'icon_name:name_service_icon,' +
      'login:user_login,' +
      'encrypted_pass:encrypted_password'
    );

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      console.warn(`Ошибка GET-запроса для ${domain}:`, res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  }
  catch (err) {
    console.error('Fetch error:', err);
    return null;
  }
}

// Функция вставки пароля //
document.addEventListener('click', async (event) => {
  const target = event.target;
  if (target.matches('input[type="text"], input[type="email"], input[type="password"]')) {
    const domain = getServiceDomain();
    const creds = await fetchCredentialsFor(domain);
    if (!creds) return;

    const loginField = document.querySelector('input[type="text"], input[type="email"]');
    if (loginField) {
      loginField.value = creds.login;
      loginField.dispatchEvent(new Event('input', { bubbles: true }));
      loginField.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const passwordField = document.querySelector('input[type="password"]');
    if (passwordField) {
      passwordField.value = creds.encrypted_pass;
      passwordField.dispatchEvent(new Event('input', { bubbles: true }));
      passwordField.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
});
