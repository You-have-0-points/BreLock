document.addEventListener('click', (event) => {
  const popup = document.getElementById('brelock-popup');
  const target = event.target;
  
  if (popup && !target.closest('#brelock-popup')) {
    popup.remove();
  }

  if (target.matches('input[type="password"]')) {
    event.stopPropagation();
    createPopup(target, event);
  }
});

function createPopup(inputField, event) {
  const existingPopup = document.getElementById('brelock-popup');
  if (existingPopup) existingPopup.remove();

  const popup = document.createElement('div');
  popup.id = 'brelock-popup';
  popup.textContent = 'Вставить пароль';

  Object.assign(popup.style, {
    position: 'absolute',
    left: `${event.pageX}px`,       
    top: `${event.pageY + 20}px`,
    backgroundColor: '#fff',
	color: '#ff0000',
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '8px 16px',
    cursor: 'pointer',
    zIndex: '2147483647',          
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif'
  });

  popup.addEventListener('click', (e) => {
    inputField.value = 'password)';
    inputField.dispatchEvent(new Event('input', { bubbles: true }));
    inputField.dispatchEvent(new Event('change', { bubbles: true }));
    popup.remove();
    e.stopPropagation(); 
  }); 

  document.body.appendChild(popup);
} 