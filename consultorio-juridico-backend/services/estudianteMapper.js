// Helper function to format 12h time
function formatTime12h(timeStr) {
    if (!timeStr) return '';
    const [hourStr, minStr] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minStr} ${ampm}`;
}

const mapDbEstudianteToFrontend = (est) => {
    // Arreglar el formato de fecha para que envié YYYY-MM-DD sin T ni Z
    let fechaFormateada = '';
    if (est.fecha_nacimiento) {
        const dateObj = new Date(est.fecha_nacimiento);
        fechaFormateada = dateObj.toISOString().split('T')[0];
    }

    let turnoTextoObj = { dia: 'Sin asignar', detalle: '' };
    if (est.turno_dia) {
        const diaCapitalizado = est.turno_dia.charAt(0).toUpperCase() + est.turno_dia.slice(1);
        const jornadaCapitalizada = est.turno_jornada.charAt(0).toUpperCase() + est.turno_jornada.slice(1);
        turnoTextoObj = {
            dia: diaCapitalizado,
            detalle: `${jornadaCapitalizada} (${formatTime12h(est.hora_inicio)} - ${formatTime12h(est.hora_fin)})`
        };
    }

    return {
        id: est.id,
        iniciales: est.nombre_completo ? est.nombre_completo.charAt(0).toUpperCase() : '?',
        nombres: est.nombre_completo,
        apellidos: '', // Ya va explícito en el nombre completo
        email: est.correo,
        nivel: est.consultorio || 'I',
        semestre: est.semestre,
        tipoDoc: est.tipo_documento,
        documento: est.numero_documento,
        fechaNacimiento: fechaFormateada,
        eps: est.eps || 'N/A',
        residencia: est.direccion || 'N/A',
        departamento: est.departamento || 'N/A',
        municipio: est.municipio || 'N/A',
        municipio_depto: (est.municipio || 'N/A') + ' / ' + (est.departamento || 'N/A'),
        telefono: est.telefono || 'N/A',
        correoInstitucional: est.correo_institucional || 'N/A',
        jornadaAsignaturas: est.jornada_asignaturas || 'N/A',
        areaInteres: est.area_interes || 'N/A',
        consultoriosRealizados: est.consultorios_realizados || '0',
        consultorioExterno: est.consultorio_externo || '0',
        radicados: est.radicados || 'N/A',
        trabaja: est.trabaja ? 'Sí' : 'No',
        empresa: est.empresa || 'N/A',
        cargo: est.cargo || 'N/A',
        turnoObj: turnoTextoObj,
        turnoId: est.turno_id || null,
        periodo: est.periodo_nombre || '',
        estado: est.estado || 'pendiente',
        observacionesAdmin: est.observaciones_admin || '',
        anexos: est.documentos_anexos || [],
        fechaRegistro: est.fecha_registro ? new Date(est.fecha_registro).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'
    };
};

const mapFrontendDataToDb = (data) => {
    const {
        nombres, apellidos, email, tipoDoc, documento,
        fechaNacimiento, semestre,
        departamento, municipio, direccion, telefono, correoInstitucional, eps,
        jornada_asignaturas, turnoId,
        consultorio_inscrito, area_interes, consultorios_realizados, consultorio_externo, radicados,
        trabaja, empresa, cargo
    } = data;

    const nombreCompleto = `${nombres || ''} ${apellidos || ''}`.trim();
    const tipoD = tipoDoc && ['CC', 'TI', 'CE'].includes(tipoDoc) ? tipoDoc : 'CC';
    const sem = semestre ? parseInt(semestre, 10) : 7;
    const trabajaBoolean = trabaja === 'true' || trabaja === true;

    // Fix for Check Constraint: 'manana' to 'mañana'
    let jornadaDb = jornada_asignaturas || null;
    if (jornadaDb === 'manana') jornadaDb = 'mañana';

    // Mapeo seguro de consultorios_realizados (sede) para cumplir constraint CHECK (0, 1, 2, 3, 4+)
    let consultoriosRealizadosDb = '0';
    const valSede = String(consultorios_realizados || '').trim();
    if (['0', '1', '2', '3', '4+'].includes(valSede)) {
        consultoriosRealizadosDb = valSede;
    } else {
        const numSede = parseInt(valSede, 10);
        if (!isNaN(numSede)) {
            if (numSede <= 0) consultoriosRealizadosDb = '0';
            else if (numSede === 1) consultoriosRealizadosDb = '1';
            else if (numSede === 2) consultoriosRealizadosDb = '2';
            else if (numSede === 3) consultoriosRealizadosDb = '3';
            else consultoriosRealizadosDb = '4+';
        } else {
            // fallback based on enrolled level
            if (consultorio_inscrito === 'I') consultoriosRealizadosDb = '0';
            else if (consultorio_inscrito === 'II') consultoriosRealizadosDb = '1';
            else if (consultorio_inscrito === 'III') consultoriosRealizadosDb = '2';
            else if (consultorio_inscrito === 'IV') consultoriosRealizadosDb = '3';
        }
    }

    // Mapeo seguro de área de interés para cumplir constraints
    let areaInteresDb = area_interes || null;
    if (area_interes === 'conciliacion') areaInteresDb = 'conciliacion_penal';
    else if (area_interes === 'asistencia') areaInteresDb = 'asistencia_legal';

    return {
        nombreCompleto,
        tipoD,
        documento: documento || '000000',
        fechaNacimiento: fechaNacimiento || '2000-01-01',
        email: email || 'sin@correo.com',
        sem,
        trabajaBoolean,
        jornadaDb,
        consultoriosRealizadosDb,
        consultorioExterno: String(consultorio_externo || '0'),
        areaInteresDb,
        radicados: radicados || null,
        consultorioInscrito: consultorio_inscrito || 'I',
        departamento: departamento || null,
        municipio: municipio || null,
        direccion: direccion || null,
        telefono: telefono || null,
        correoInstitucional: correoInstitucional || null,
        eps: eps || null,
        empresa: empresa || null,
        cargo: cargo || null
    };
};

const mapConsultarEstudiante = (est) => {
    let turnoTexto = 'Sin asignar';
    if (est.turno_dia) {
        const diaCapitalizado = est.turno_dia.charAt(0).toUpperCase() + est.turno_dia.slice(1);
        const jornadaCapitalizada = est.turno_jornada.charAt(0).toUpperCase() + est.turno_jornada.slice(1);
        turnoTexto = `${diaCapitalizado} - ${jornadaCapitalizada} (${formatTime12h(est.hora_inicio)} - ${formatTime12h(est.hora_fin)})`;
    }

    return {
        id: est.id,
        nombre: est.nombre_completo,
        documento: est.numero_documento,
        correo: est.correo,
        correoInstitucional: est.correo_institucional || 'N/A',
        estado: est.estado || 'pendiente',
        observaciones: est.observaciones_admin || '',
        periodo: est.periodo_nombre || '',
        consultorio: est.consultorio || 'I',
        semestre: est.semestre || '',
        turno: turnoTexto,
        fechaRegistro: est.fecha_registro
    };
};

module.exports = {
    formatTime12h,
    mapDbEstudianteToFrontend,
    mapFrontendDataToDb,
    mapConsultarEstudiante
};
