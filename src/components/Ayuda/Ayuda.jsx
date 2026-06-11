import '../InfoPage/InfoPage.css';

export default function Ayuda() {
  return (
    <div className="info-page-wrapper">
      <div className="info-page-card">
        <h1>Ayuda</h1>
        <p className="lead">
          Respuestas a las consultas más frecuentes sobre el proceso de inscripción al Consultorio Jurídico.
        </p>

        <div className="info-section">
          <h2>¿Cómo me inscribo?</h2>
          <p>
            Desde <a href="/" className="info-link">Inicio</a>, completa los 6 pasos del formulario
            y finaliza con el botón <strong>Finalizar</strong>. Recibirás un comprobante con tu número de radicado.
          </p>
        </div>

        <div className="info-section">
          <h2>¿Cómo consulto mi inscripción?</h2>
          <p>
            Ingresa a{' '}
            <a href="/consultar-inscripciones" className="info-link">Consultar inscripciones</a>{' '}
            con tu número de documento o correo institucional.
          </p>
        </div>

        <div className="info-section">
          <h2>¿Qué hago si el cupo de mi turno está lleno?</h2>
          <p>
            Selecciona otro día u horario disponible en el paso de información personal.
            El panel de cupos del inicio muestra la disponibilidad actualizada.
          </p>
        </div>

        <div className="info-section">
          <h2>¿Qué hago si aparece que mi documento ya está registrado?</h2>
          <p>
            Es posible que ya hayas completado la inscripción. Consulta tu estado con tu documento.
            Si necesitas corregir datos, comunícate con el Consultorio Jurídico.
          </p>
        </div>

        <div className="info-section">
          <h2>Contacto</h2>
          <div className="info-contact-box">
            <strong>Consultorio Jurídico — Seccional Pereira</strong>
            <br />
            Correo:{' '}
            <a href="mailto:consultareandina@areandina.edu.co" className="info-link">
              consultareandina@areandina.edu.co
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
