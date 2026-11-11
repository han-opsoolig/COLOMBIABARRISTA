// Lógica del Cursor Interactivo (Efecto Balón / Zapato)
document.addEventListener('mousedown', () => document.body.classList.add('kicking'));
document.addEventListener('mouseup', () => document.body.classList.remove('kicking'));

// FECHA DE LANZAMIENTO (Diciembre 15, 2026)
const fechaLanzamiento = new Date("2026-12-15T12:00:00-05:00").getTime();

const actualizarReloj = setInterval(() => {
    const ahora = new Date().getTime();
    const distancia = fechaLanzamiento - ahora;

    if (distancia < 0) {
        clearInterval(actualizarReloj);
        document.getElementById("reloj").textContent = "Fecha objetivo alcanzada. Consulta el estado oficial del lanzamiento.";
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

// 📌 LIBRERÍA DINÁMICA DE BARRAS (MINISTERIO DEL INTERIOR)
const barrasPorEquipo = {
    AtleticoBucaramanga: [
        { id: "comandos_azules_bga", nombre: "1. La Barra El Indio / Comandos Azules (Bucaramanga)" },
        { id: "frente_rojoblan_bga", nombre: "2. Frente Aliancista y Popular Bucaramanga" }
    ],
    AtleticoNacional: [
        { id: "los_del_sur", nombre: "1. Los Del Sur (Nacional)" },
        { id: "nacion_verdolaga", nombre: "2. Nación Verdolaga Convivencia" }
    ],
    AmericaDeCali: [
        { id: "baron_rojo_sur", nombre: "1. Barón Rojo Sur (América)" },
        { id: "distrito_rojo", nombre: "2. Distrito Rojo Popular" }
    ],
    Millonarios: [
        { id: "comandos_azules", nombre: "1. Comandos Azules Distrito Capital" },
        { id: "blue_rain", nombre: "2. Blue Rain (Millonarios)" }
    ],
    SantaFe: [
        { id: "guardia_albiroja", nombre: "1. La Guardia Albi-Roja Sur" }
    ],
    Junior: [
        { id: "frente_roji_blanco", nombre: "1. Frente Roji-Blanco Sur" },
        { id: "los_kuervos", nombre: "2. Los Kuervos de Barranquilla" }
    ],
    DeportivoCali: [
        { id: "frente_radical_verde", nombre: "1. Frente Radical Verdiblanco" },
        { id: "grueso_cali", nombre: "2. La Gloriosa Banda de Cali" }
    ],
    Medellin: [
        { id: "rex_ixtix", nombre: "1. RexixtenCia Norte (DIM)" }
    ],
    OnceCaldas: [
        { id: "holocausto_norte", nombre: "1. Holocausto Norte (Once Caldas)" }
    ],
    DeportesTolima: [
        { id: "revolucion_vinotinto", nombre: "1. Revolución Vinotinto Sur" }
    ],
    Pereira: [
        { id: "lobo_sur", nombre: "1. Lobo Sur Pereira" }
    ],
    JuniorEquiposB: [
        { id: "barras_a_b", nombre: "1. Red de Barras Acreditadas Categoría B y Cundinamarca" }
    ]
};

function actualizarBarrasAsociadas() {
    const equipoSelect = document.getElementById('regEquipo');
    const barraSelect = document.getElementById('regBarraOficial');
    const equipoSeleccionado = equipoSelect.value;
    const grupoOtroEquipo = document.getElementById('grupoOtroEquipo');
    const otroEquipo = document.getElementById('regOtroEquipo');
    grupoOtroEquipo.hidden = equipoSeleccionado !== 'OtroEquipo';
    otroEquipo.required = equipoSeleccionado === 'OtroEquipo';

    barraSelect.innerHTML = '<option value="">-- Selecciona una barra (lista orientativa) --</option>';

    if (barrasPorEquipo[equipoSeleccionado]) {
        barrasPorEquipo[equipoSeleccionado].forEach(barra => {
            const opt = document.createElement('option');
            opt.value = barra.nombre;
            opt.textContent = barra.nombre;
            barraSelect.appendChild(opt);
        });
    }

    const optCrear = document.createElement('option');
    optCrear.value = "CREAR_NUEVA";
    optCrear.textContent = "➕ ¡Mi barra no está / Registrar y crear mi propia barra!";
    barraSelect.appendChild(optCrear);

    document.getElementById('grupoCrearBarra').hidden = true;
    document.getElementById('regNuevaBarra').required = false;
}

function verificarCreacionBarra() {
    const barraSelect = document.getElementById('regBarraOficial');
    const grupoCrear = document.getElementById('grupoCrearBarra');
    
    if (barraSelect.value === "CREAR_NUEVA") {
        grupoCrear.hidden = false;
        document.getElementById('regNuevaBarra').required = true;
    } else {
        grupoCrear.hidden = true;
        document.getElementById('regNuevaBarra').required = false;
    }
}

// CONEXIÓN SUPABASE Y GESTIÓN DE SESIÓN
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
    console.error('[Colombia Barrista] Error de autenticación:', { code: error?.code, status: error?.status, message: error?.message });
    const messages = {
        invalid_credentials: 'Correo o contraseña incorrectos.',
        email_not_confirmed: 'Confirma primero tu correo mediante el enlace recibido.',
        user_already_exists: 'Ya existe una cuenta con ese correo. Intenta iniciar sesión.',
        weak_password: 'La contraseña no cumple los requisitos de seguridad.',
        over_email_send_rate_limit: 'Se alcanzó el límite de correos. Espera antes de volver a intentarlo.',
        over_request_rate_limit: 'Demasiados intentos. Espera antes de volver a intentarlo.',
        signup_disabled: 'El registro está desactivado en la configuración del proyecto.',
        invalid_api_key: 'La clave pública de Supabase no es válida. Verifica Project Settings → API Keys.',
        validation_failed: 'Los datos de acceso no superaron la validación de Supabase.'
    };
    if (messages[error?.code]) return messages[error.code];
    if (error?.message && /fetch|network|failed to fetch/i.test(error.message)) return 'No hay conexión con Supabase. Comprueba Internet y abre la página desde un servidor HTTP/HTTPS.';
    return `No se pudo completar la solicitud (${error?.code || error?.status || 'sin código'}). Revisa la consola del navegador (F12) para conocer el detalle.`;
}

async function submitAuth(event, mode) {
    event.preventDefault();
    const form = event.currentTarget || event.target;
    if (!form.reportValidity()) return;
    if (!authClient) { showAuthMessage('No se pudo cargar Supabase. Comprueba Internet y recarga la página.'); return; }
    
    const button = form.querySelector('button[type="submit"]');
    if (button.disabled) return;
    button.disabled = true;
    showAuthMessage(mode === 'register' ? 'Procesando registro…' : 'Iniciando sesión…');

    try {
        const registering = mode === 'register';
        const email = document.getElementById(registering ? 'regEmail' : 'loginEmail').value.trim();
        const password = document.getElementById(registering ? 'regPassword' : 'loginPassword').value;
        let result;

        if (registering) {
            const equipoSeleccionado = document.getElementById('regEquipo').value;
            const equipo = equipoSeleccionado === 'OtroEquipo' ? document.getElementById('regOtroEquipo').value.trim() : equipoSeleccionado;
            const barraSelect = document.getElementById('regBarraOficial').value;
            const nuevaBarraInput = document.getElementById('regNuevaBarra').value.trim();
            
            const nombreBarraFinal = barraSelect === "CREAR_NUEVA" ? nuevaBarraInput : barraSelect;
            
            if (!equipo || !nombreBarraFinal || nombreBarraFinal === "CREAR_NUEVA") { 
                showAuthMessage('Selecciona tu equipo y tu barra u organización.'); 
                button.disabled = false;
                return; 
            }

            result = await authClient.auth.signUp({ 
                email, 
                password, 
                options: { 
                    data: { 
                        equipo_favorito: equipo, 
                        barra_oficial: nombreBarraFinal 
                    } 
                } 
            });
        } else {
            result = await authClient.auth.signInWithPassword({ email, password });
        }

        if (result.error) throw result.error;
        renderSession(result.data.session);
        showAuthMessage(registering && !result.data.session
            ? 'Solicitud de registro recibida. Si se requiere confirmación, revisa tu correo y spam. Si ya tenías cuenta, inicia sesión.'
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
        console.error('[Colombia Barrista] Inicialización Supabase:', error);
        showAuthMessage(authError(error));
    }
}

initializeAuth();
function reproducirAudioInicio() {
    const audio = document.getElementById('audio-inicio');
    if (audio) audio.play().catch(() => {
        showAuthMessage('El navegador bloqueó el audio. Toca el botón nuevamente para reproducirlo.');
    });
}
