// Lógica del Cursor Interactivo (Efecto Balón / Zapato)
document.addEventListener('mousedown', () => document.body.classList.add('kicking'));
document.addEventListener('mouseup', () => document.body.classList.remove('kicking'));

// FECHA DE LANZAMIENTO (Diciembre 15, 2026)
const fechaLanzamiento = new Date("Dec 15, 2026 12:00:00").getTime();

const actualizarReloj = setInterval(() => {
    const ahora = new Date().getTime();
    const distancia = fechaLanzamiento - ahora;

    if (distancia < 0) {
        clearInterval(actualizarReloj);
        document.getElementById("reloj").innerHTML = "<h2 class='text-primary font-display'>¡EL METAVERSO ESTÁ EN VIVO!</h2>";
        return;
    }

    document.getElementById("dias").innerText = String(Math.floor(distancia / (1000 * 60 * 60 * 24))).padStart(2, '0');
    document.getElementById("horas").innerText = String(Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
    document.getElementById("minutos").innerText = String(Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    document.getElementById("segundos").innerText = String(Math.floor((distancia % (1000 * 60)) / 1000)).padStart(2, '0');
}, 1000);

// Sistema de Pestañas Auth (Login / Registro)
function switchTab(tab) {
    const btnLogin = document.getElementById('btnTabLogin');
    const btnRegister = document.getElementById('btnTabRegister');
    const formLogin = document.getElementById('formLogin');
    const formRegister = document.getElementById('formRegister');

    if (tab === 'login') {
        btnLogin.classList.add('active');
        btnRegister.classList.remove('active');
        formLogin.style.display = 'block';
        formRegister.style.display = 'none';
    } else {
        btnRegister.classList.add('active');
        btnLogin.classList.remove('active');
        formRegister.style.display = 'block';
        formLogin.style.display = 'none';
    }
}

// Manejo del Registro con Credenciales y Parche
function handleRegister(event) {
    event.preventDefault();
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const parche = document.getElementById('regParche').value;

    localStorage.setItem('colbarrista_user', JSON.stringify({ email, parche }));
    alert(`¡Registro exitoso para ${email}! Perteneciente al parche: ${parche}. Bienvenido al ecosistema.`);
    document.getElementById('formRegister').reset();
}

// Manejo del Login de Usuarios
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    
    alert(`¡Bienvenido de nuevo, ${email}! Sesión iniciada correctamente en la plataforma.`);
    document.getElementById('formLogin').reset();
}