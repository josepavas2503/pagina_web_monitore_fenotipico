// Almacena las listas para no volver a cargar si ya se consultó
const cacheS3 = {
    imagenes: [],
    segmentacion: []
};

function showView(viewName) {
    // Ocultar todas las vistas y quitar el foco de los botones
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));

    // Mostrar la vista seleccionada
    document.getElementById(`view-${viewName}`).classList.add('active');
    document.getElementById(`btn-${viewName}`).classList.add('active');

    // Cargar S3 automáticamente si la pestaña lo requiere y está vacía
    if (viewName === 'imagenes' && cacheS3.imagenes.length === 0) {
        cargarDesdeS3('imagenes', 'select-img');
    }
    if (viewName === 'segmentacion-img' && cacheS3.segmentacion.length === 0) {
        cargarDesdeS3('segmentacion', 'select-seg');
    }
}

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