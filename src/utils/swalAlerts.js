import Swal from 'sweetalert2/dist/sweetalert2.esm.all.js';

const swalBase = {
    confirmButtonColor: '#7FB536',
    cancelButtonColor: '#64748b',
    reverseButtons: true,
};

export const confirmQuitarEstudiante = async (nombre) => {
    const result = await Swal.fire({
        ...swalBase,
        title: '¿Quitar estudiante?',
        html: `Se eliminará el registro de <strong>${nombre}</strong> y se liberará su turno.<br/>Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, quitar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc2626',
    });
    return result.isConfirmed;
};

export const alertQuitarExito = () =>
    Swal.fire({
        ...swalBase,
        title: 'Estudiante quitado',
        text: 'El registro fue eliminado y el cupo quedó disponible.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
    });

export const alertQuitarError = (message) =>
    Swal.fire({
        ...swalBase,
        title: 'No se pudo quitar',
        text: message || 'Ocurrió un error al eliminar el estudiante.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
    });

export const confirmCerrarSesion = async () => {
    const result = await Swal.fire({
        ...swalBase,
        title: '¿Cerrar sesión?',
        text: 'Saldrás del panel de administración.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar',
    });
    return result.isConfirmed;
};

const swalInscripcionBase = {
    ...swalBase,
    customClass: {
        popup: 'swal-inscripcion-popup',
        title: 'swal-inscripcion-title',
        htmlContainer: 'swal-inscripcion-text',
        confirmButton: 'swal-inscripcion-btn',
        cancelButton: 'swal-inscripcion-btn-cancel',
    },
};

export const alertDocumentoDuplicado = async () => {
    const result = await Swal.fire({
        ...swalInscripcionBase,
        title: 'Documento ya registrado',
        icon: 'warning',
        html: `
            <p class="swal-msg-primary">
                Este número de documento ya está registrado en el sistema.
            </p>
            <p class="swal-msg-secondary">
                Si acabas de completar tu inscripción, no necesitas volver a enviar el formulario.
                Puedes consultar tu radicado con el botón de abajo.
            </p>
        `,
        showCancelButton: true,
        confirmButtonText: 'Consultar mi inscripción',
        cancelButtonText: 'Volver al formulario',
        confirmButtonColor: '#7FB536',
    });

    if (result.isConfirmed) {
        window.location.href = '/consultar-inscripciones';
    }
};

export const alertErrorInscripcion = (message) =>
    Swal.fire({
        ...swalInscripcionBase,
        title: 'No se pudo completar la inscripción',
        text: message || 'Ocurrió un error al guardar tu solicitud. Intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Entendido',
    });

export const alertErrorConexion = () =>
    Swal.fire({
        ...swalInscripcionBase,
        title: 'Error de conexión',
        text: 'No pudimos comunicarnos con el servidor. Verifica tu conexión e intenta de nuevo.',
        icon: 'error',
        confirmButtonText: 'Entendido',
    });

export const alertSeleccionarPeriodo = () =>
    Swal.fire({
        ...swalBase,
        title: 'Selecciona un periodo',
        text: 'Debes elegir un periodo académico antes de generar los turnos.',
        icon: 'info',
        confirmButtonText: 'Entendido',
    });

export const confirmGenerarTurnos = async (periodoNombre) => {
    const result = await Swal.fire({
        ...swalBase,
        title: '¿Generar turnos automáticamente?',
        html: `
            <p style="margin:0 0 14px;color:#5a6476;line-height:1.5;text-align:left;">
                Se crearán turnos para todos los días (lunes a viernes) del periodo
                <strong>${periodoNombre}</strong>:
            </p>
            <ul style="margin:0;padding-left:1.2em;text-align:left;color:#3d4654;line-height:1.6;">
                <li><strong>Mañana:</strong> 8:00 AM – 12:00 PM · 11 cupos</li>
                <li><strong>Tarde:</strong> 2:00 PM – 5:00 PM · 11 cupos</li>
            </ul>
            <p style="margin:14px 0 0;color:#6b7280;font-size:0.9em;text-align:left;">
                Los turnos que ya existan no se duplicarán.
            </p>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, generar',
        cancelButtonText: 'Cancelar',
    });
    return result.isConfirmed;
};

export const alertGenerarTurnosResultado = (creados, errores) =>
    Swal.fire({
        ...swalBase,
        title: creados > 0 ? 'Turnos generados' : 'Sin turnos nuevos',
        html: creados > 0
            ? `Se crearon <strong>${creados}</strong> turno${creados === 1 ? '' : 's'} nuevos.${
                errores > 0
                    ? `<br/><span style="color:#6b7280;margin-top:8px;display:inline-block;">${errores} turno${errores === 1 ? '' : 's'} ya existía${errores === 1 ? '' : 'n'} o tuvo error.</span>`
                    : ''
            }`
            : 'Todos los turnos por defecto ya existían para este periodo.',
        icon: creados > 0 ? 'success' : 'info',
        confirmButtonText: 'Aceptar',
    });
