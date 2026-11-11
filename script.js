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


// La clave publicable identifica la aplicación; no concede privilegios de administrador.
const SUPABASE_URL = 'https://cubrswxcnhvmltlnbmtg.supabase.co';
const SUPABASE_PUBLIC_KEY = 'sb_publishable_A4k9IfdLCFGd9eA4kQw_0A_rpZUFH7p';
let authClient = null;
function showAuthMessage(message) {
    document.getElementById('authMessage').textContent = message;
}
function renderSession(session) {
    const signedIn = Boolean(session && session.user);
    document.getElementById('sessionPanel').hidden = !signedIn;
    document.getElementById('authTabs').style.display = signedIn ? 'none' : '';
    document.getElementById('sessionEmail').textContent = signedIn ? `Sesión iniciada: ${session.user.email}` : '';
    if (signedIn) {
        document.getElementById('formLogin').style.display = 'none';
        document.getElementById('formRegister').style.display = 'none';
    } else {
        switchTab('login');
    }
}
function authError(error) {
    const messages = {
        invalid_credentials: 'Correo o contraseña incorrectos.',
        email_not_confirmed: 'Confirma primero tu correo mediante el enlace recibido.',
        user_already_exists: 'Ya existe una cuenta con ese correo. Intenta iniciar sesión.',
        weak_password: 'La contraseña no cumple los requisitos de seguridad.',
        over_email_send_rate_limit: 'Se alcanzó el límite de correos. Espera antes de volver a intentarlo.',
        over_request_rate_limit: 'Demasiados intentos. Espera antes de volver a intentarlo.',
        signup_disabled: 'El registro está desactivado en la configuración del proyecto.'
    };
    return messages[error.code] || 'No se pudo completar la solicitud. Revisa tu conexión y la configuración de Supabase e inténtalo de nuevo.';
}
async function submitAuth(event, mode) {
    event.preventDefault();
    const form = event.currentTarget || event.target;
    if (!form.reportValidity()) return;
    if (!authClient) { showAuthMessage('No se pudo cargar Supabase. Comprueba Internet y recarga la página.'); return; }
    const button = form.querySelector('button[type="submit"]');
    if (button.disabled) return;
    button.disabled = true;
    showAuthMessage('Procesando…');
    try {
        const registering = mode === 'register';
        const email = document.getElementById(registering ? 'regEmail' : 'loginEmail').value.trim();
        const password = document.getElementById(registering ? 'regPassword' : 'loginPassword').value;
        let result;
        if (registering) {
            const parche = document.getElementById('regParche').value.trim();
            if (!parche) { showAuthMessage('Escribe el nombre de tu parche u organización.'); return; }
            // El parche es un dato de perfil, nunca un permiso o rol de acceso.
            result = await authClient.auth.signUp({ email, password, options: { data: { parche } } });
        } else {
            result = await authClient.auth.signInWithPassword({ email, password });
        }
        if (result.error) throw result.error;
        renderSession(result.data.session);
        showAuthMessage(registering && !result.data.session
            ? 'Solicitud recibida. Revisa tu correo y la carpeta de spam para confirmar tu cuenta. Si ya tienes cuenta, inicia sesión.'
            : 'Sesión iniciada correctamente.');
        form.reset();
    } catch (error) {
        showAuthMessage(authError(error));
    } finally {
        button.disabled = false;
    }
}
function handleRegister(event) { return submitAuth(event, 'register'); }
function handleLogin(event) { return submitAuth(event, 'login'); }
async function handleLogout() {
    if (!authClient) return;
    const button = document.getElementById('logoutButton');
    button.disabled = true;
    try {
        const { error } = await authClient.auth.signOut({ scope: 'local' });
        if (error) throw error;
        renderSession(null);
        showAuthMessage('Sesión cerrada.');
    } catch (error) { showAuthMessage(authError(error)); }
    finally { button.disabled = false; }
}
async function initializeAuth() {
    try {
        if (!window.supabase) throw new Error('SDK unavailable');
        authClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
        authClient.auth.onAuthStateChange((_event, session) => renderSession(session));
        const { data, error } = await authClient.auth.getSession();
        if (error) throw error;
        renderSession(data.session);
    } catch (error) {
        showAuthMessage('No se pudo iniciar la conexión con Supabase. Comprueba Internet y recarga la página.');
    }
}
initializeAuth();
