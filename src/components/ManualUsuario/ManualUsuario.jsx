import { useState } from 'react';
import './ManualUsuario.css';

export default function ManualUsuario() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuAq6rhiuZHAoWf8u_8asTLUazWmCOGd9srvgWKavMYrh3ONWRC3VVW3fLHkyilCgNgr5Vbl8e3tU2pxzgJvlEWDunAboCVRTD9NUHKLjnGZFFBBF77w4zS977NIMKUEwLfzAzEAdAfJRa9h8L1xEPNbWgpbben9Swq6N5oYs_bBx1YEklu0nZNHyFUbRsQytMjG48i_aoqezY2J1ERpYgDGZl-CVXJ7Mkhx6e5Qruvl7h6jo6zcl3NQfXH2ESEWqH4xUvty9JPUnqc";

  return (
    <div className="manual-container">
      {/* Hero Section */}
      <section className="manual-hero">
        <div className="manual-hero-content">
          <div className="manual-hero-text">
            <span className="manual-tag">Centro de Ayuda</span>
            <h1 className="manual-hero-title">Guía de Inscripción</h1>
            <p className="manual-hero-desc">
              El proceso de inscripción es el primer paso para tu práctica profesional. Sigue este manual detallado para asegurar tu vinculación al Consultorio Jurídico de Areandina de manera exitosa y oportuna.
            </p>
            <div className="manual-hero-actions">
              <a href="/" className="btn-primary-hero" style={{ textDecoration: 'none', display: 'inline-block' }}>
                Iniciar Mi Inscripción
              </a>
              <button className="btn-secondary-hero" onClick={() => setIsModalOpen(true)}>
                <span className="material-symbols-outlined">play_circle</span>
                Ver Videotutorial
              </button>
            </div>
          </div>
          <div className="manual-hero-image-wrapper">
            <div className="manual-hero-blur"></div>
            <div className="manual-hero-img-container">
              <img
                alt="Estudio legal y documentación"
                className="manual-hero-img"
                src={imageUrl}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Guide: Bento Grid Layout */}
      <section style={{ padding: '2rem 0' }}>
        <div className="manual-section-header">
          <div className="accent-bar"></div>
          <h2 className="manual-section-title">Ruta de Inscripción Paso a Paso</h2>
        </div>

        <div className="bento-grid">
          {/* Step 1 */}
          <div className="bento-card bento-card-bg-low span-8">
            <div className="step-header">
              <span className="step-num">1</span>
              <h3 className="step-title">Información Personal & Selección de Turno</h3>
            </div>
            <p className="step-desc">
              Ingresa tus datos básicos de identidad, fecha de nacimiento y jornada actual de asignaturas. Además, deberás **seleccionar tu día y horario de turno de prácticas**. Elige uno que no presente cruces de horario.
            </p>
            <div className="step-tags">
              <span className="step-tag">Datos de Identidad</span>
              <span className="step-tag">Selección de Horario (Cupos)</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bento-card bento-card-border span-4">
            <span className="step-num-secondary">2</span>
            <h3 className="step-title" style={{ marginBottom: '1rem' }}>Residencia & Contacto</h3>
            <p className="step-desc-sm">
              Dirección de residencia, teléfono de contacto, **correo institucional** (@areandina) y tu entidad prestadora de salud (**EPS**).
            </p>
          </div>

          {/* Step 3 */}
          <div className="bento-card bento-card-tertiary span-4">
            <span className="step-num-tertiary">3</span>
            <h3 className="step-title" style={{ marginBottom: '1rem' }}>Información Académica</h3>
            <p className="step-desc-sm">
              Selección del nivel de consultorio (I-IV). El sistema filtrará automáticamente según tus créditos aprobados.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bento-card bento-card-bg-low span-8">
            <div className="flex-row-center">
              <div className="shrink-none" style={{ display: 'flex', justifyContent: 'center' }}>
                <span className="step-num-large">4</span>
              </div>
              <div>
                <h3 className="step-title" style={{ marginBottom: '0.5rem' }}>Información Laboral</h3>
                <p className="step-desc" style={{ fontSize: '1rem' }}>
                  Si trabajas, deberás registrar los datos de tu empleo. En este paso deberás adjuntar tu **Certificación de Funciones** firmada para validar la compatibilidad horaria.
                </p>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bento-card bento-card-border-left span-6">
            <div className="step-header-spaced">
              <span className="step-num">5</span>
              <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: 'rgba(65, 105, 0, 0.5)' }}>upload_file</span>
            </div>
            <h3 className="step-title" style={{ marginBottom: '1rem' }}>Anexos y Documentación</h3>
            <ul className="step-list">
              <li className="step-list-item">
                <span className="material-symbols-outlined">check_circle</span> Escaneo de Cédula (PDF)
              </li>
              <li className="step-list-item">
                <span className="material-symbols-outlined">check_circle</span> Certificado EPS (vigencia máx. 30 días)
              </li>
              <li className="step-list-item">
                <span className="material-symbols-outlined">check_circle</span> Consentimiento Informado (Firmado)
              </li>
              <li className="step-list-item">
                <span className="material-symbols-outlined">check_circle</span> Acta de Compromiso (Firmado)
              </li>
              <li className="step-list-item">
                <span className="material-symbols-outlined">check_circle</span> Hoja de Vida Institucional
              </li>
            </ul>
          </div>

          {/* Step 6 */}
          <div className="bento-card bento-card-inverse span-6">
            <span className="step-num-inverse">6</span>
            <h3 className="step-title" style={{ marginBottom: '0.5rem' }}>Finalización</h3>
            <p className="step-desc-sm" style={{ opacity: 0.8, color: 'inherit' }}>
              Aceptación de declaración juramentada y confirmación de envío. Recibirás un folio de registro en tu correo.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section: Accordion Style */}
      <section className="faq-section">
        <div className="faq-content">
          <div className="faq-header">
            <h2 className="faq-title">Preguntas Frecuentes</h2>
            <p className="faq-desc">Todo lo que necesitas saber sobre el sistema de inscripciones.</p>
          </div>
          <div className="faq-list">
            <details className="faq-item">
              <summary>
                <span>¿Qué documentos necesito?</span>
                <span className="material-symbols-outlined">expand_more</span>
              </summary>
              <div className="faq-answer">
                Debe cargar escaneos legibles en formato <strong>PDF</strong>. El peso máximo permitido por archivo es de <strong>10MB</strong>. Los documentos requeridos son: Cédula de ciudadanía, Certificado de EPS (no mayor a 30 días) y Hoja de Vida.
              </div>
            </details>

            <details className="faq-item">
              <summary>
                <span>¿Cómo elijo mi horario?</span>
                <span className="material-symbols-outlined">expand_more</span>
              </summary>
              <div className="faq-answer">
                La selección se realiza en el **Paso 1 (Información Personal & Selección de Turno)** del formulario. Tenga en cuenta que cada franja horaria está **sujeta a disponibilidad de cupos** (11 estudiantes por bloque). Se recomienda realizar el proceso en las primeras horas de apertura.
              </div>
            </details>

            <details className="faq-item">
              <summary>
                <span>¿Qué pasa con la ARL?</span>
                <span className="material-symbols-outlined">expand_more</span>
              </summary>
              <div className="faq-answer">
                No es necesario que usted realice el trámite por su cuenta. <strong>El sistema gestiona la afiliación automáticamente</strong> ante la aseguradora correspondiente tras el registro exitoso en la plataforma.
              </div>
            </details>

            <details className="faq-item">
              <summary>
                <span>¿Puedo editar mi inscripción?</span>
                <span className="material-symbols-outlined">expand_more</span>
              </summary>
              <div className="faq-answer">
                Una vez finalizado el envío, los datos se bloquean para revisión. Cualquier modificación posterior <strong>solo se puede realizar a través del panel administrativo</strong> solicitándolo directamente con el coordinador del consultorio.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">¿Listo para comenzar tu práctica?</h2>
            <p className="cta-desc">
              Accede ahora al portal de inscripciones y asegura tu cupo para el periodo académico. El sistema estará abierto hasta el cierre del periodo académico actual.
            </p>
            <a href="/" className="btn-cta" style={{ textDecoration: 'none', display: 'inline-block' }}>
              Ir al Portal de Inscripción
            </a>
          </div>
          <div className="cta-decor-1"></div>
          <div className="cta-decor-2"></div>
        </div>
      </section>

      {/* Video Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-bg" onClick={() => setIsModalOpen(false)}></div>
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Videotutorial: Paso a Paso de Inscripción</h3>
              <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="video-player-wrapper" style={{ cursor: 'auto' }}>
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/8MFhZQHT4Do?autoplay=1"
                  title="Videotutorial de Inscripción"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ border: 'none' }}
                ></iframe>
              </div>
              <div className="modal-desc">
                <p>
                  En este video aprenderás a navegar por el portal de inscripciones, cargar correctamente tus documentos en formato PDF y seleccionar tus horarios de práctica.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
