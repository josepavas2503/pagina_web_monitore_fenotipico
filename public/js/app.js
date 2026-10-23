// Almacena las listas para no volver a cargar si ya se consultó
const cacheS3 = {
    imagenes: [],
    segmentacion: []
};

// ... código anterior de app.js ...

function showView(viewName) {
    // 1. Ocultar todas las vistas y desactivar todos los botones
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));

    // 2. Limpiar el nombre por si viene con prefijo 'view-'
    const cleanName = viewName.replace(/^view-/, '');

    // 3. Obtener los elementos del DOM
    const targetView = document.getElementById(`view-${cleanName}`);
    const targetBtn = document.getElementById(`btn-${cleanName}`);

    // 4. Activar la vista y el botón solo si existen en el HTML
    if (targetView) {
        targetView.classList.add('active');
    } else {
        console.warn(`No se encontró el contenedor con ID: view-${cleanName}`);
    }

    if (targetBtn) {
        targetBtn.classList.add('active');
    }

    // 5. Cargar S3 si aplica
    if (cleanName === 'imagenes' && cacheS3.imagenes?.length === 0) {
        cargarDesdeS3('imagenes', 'select-img');
    }
    if (cleanName === 'segmentacion-img' && cacheS3.segmentacion?.length === 0) {
        cargarDesdeS3('segmentacion', 'select-seg');
    }
}

// ... resto de tu app.js ...

async function cargarDesdeS3(carpeta, selectId) {
    try {
        const res = await fetch(`/api/s3/${carpeta}`);
        const data = await res.json();
        cacheS3[carpeta] = data;
        
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">-- Selecciona una foto --</option>';

        data.forEach(img => {
            const option = document.createElement('option');
            option.value = img.url;
            option.textContent = img.nombre;
            select.appendChild(option);
        });
    } catch (e) {
        console.error(`Error al cargar ${carpeta}`, e);
    }
}

function displayImage(selectId, viewerId, placeholderId) {
    const url = document.getElementById(selectId).value;
    const imgEl = document.getElementById(viewerId);
    const placeholder = document.getElementById(placeholderId);

    if (url) {
        imgEl.src = url;
        imgEl.style.display = 'block';
        placeholder.style.display = 'none';
    } else {
        imgEl.style.display = 'none';
        placeholder.style.display = 'block';
    }
}