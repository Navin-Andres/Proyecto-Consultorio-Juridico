import '../InfoPage/InfoPage.css';

export default function Reglamento() {
  return (
    <div className="info-page-wrapper">
      <div className="info-page-card">
        <h1>Reglamento</h1>
        <p className="lead">
          Normas generales para la inscripción y participación en la práctica del Consultorio Jurídico Areandina.
        </p>

        <div className="info-section">
          <h2>Inscripción</h2>
          <ul>
            <li>La inscripción se realiza únicamente a través del formulario oficial del sistema.</li>
            <li>Cada estudiante puede registrarse una sola vez por periodo académico.</li>
            <li>Los cupos por día y jornada son limitados (11 estudiantes por turno).</li>
            <li>La información suministrada debe ser verídica y estar respaldada por los documentos solicitados.</li>
          </ul>
        </div>

        <div className="info-section">
          <h2>Asistencia y turnos</h2>
          <ul>
            <li>El turno asignado (día y horario) debe respetarse durante el periodo de práctica.</li>
            <li>Los cambios de turno están sujetos a disponibilidad y autorización del Consultorio Jurídico.</li>
            <li>La inasistencia reiterada puede generar observaciones en el seguimiento académico.</li>
          </ul>
        </div>

        <div className="info-section">
          <h2>Documentación</h2>
          <ul>
            <li>Es obligatorio cargar todos los anexos requeridos en el formulario de inscripción.</li>
            <li>Los documentos deben estar legibles y vigentes al momento del registro.</li>
            <li>La afiliación a la ARL se gestionará con base en la inscripción confirmada.</li>
          </ul>
        </div>

        <div className="info-section">
          <h2>Datos personales</h2>
          <p>
            El tratamiento de la información se realiza conforme a la Ley 1581 de 2012 y las políticas
            institucionales de la Fundación Universitaria del Área Andina.
          </p>
        </div>
      </div>
    </div>
  );
}
