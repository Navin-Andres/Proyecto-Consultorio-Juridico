import React, { useState } from 'react';
import './ManualUsuario.css';

const sections = [
  {
    id: 'inicio',
    title: 'Inicio',
    subtitle: 'Completa tu inscripción paso a paso desde la página principal.',
    description: 'En la página principal, los estudiantes pueden completar el formulario de inscripción en seis pasos. Cada paso guarda tus datos y te muestra qué falta por completar.',
    points: [
      'Paso 1: Información personal',
      'Paso 2: Datos de contacto e institucionales',
      'Paso 3: Información académica',
      'Paso 4: Información laboral',
      'Paso 5: Anexos',
      'Paso 6: Declaraciones finales y envío',
    ],
  },
  {
    id: 'consultar',
    title: 'Consultar inscripciones',
    subtitle: 'Revisa el estado de tu registro en cualquier momento.',
    description: 'Desde el menú, selecciona Consultar inscripciones para buscar tu estado por documento o correo institucional. Ahí verás si tu inscripción fue recibida correctamente.',
    points: [
      'Busca por documento de identidad o correo institucional.',
      'Verifica el turno asignado.',
      'Confirma si la inscripción está completa o faltan documentos.',
    ],
  },
  {
    id: 'correo',
    title: 'Correo institucional',
    subtitle: 'Usa tu cuenta oficial Areandina para inscribirte.',
    description: 'El formulario requiere un correo institucional válido de Areandina. También se aceptan subdominios de estudiantes para mayor flexibilidad.',
    points: [
      'Ejemplos válidos: @estudiantes.areandina.edu.co o @areandina.edu.co.',
      'Si tu correo no es institucional, no podrás avanzar.',
      'Revisa bien el correo antes de enviar.',
    ],
  },
  {
    id: 'administracion',
    title: 'Administración',
    subtitle: 'Solo para personal autorizado, con acceso al panel administrativo.',
    description: 'Los administradores acceden desde el botón LOGIN en el menú. En su panel pueden ver estudiantes inscritos y gestionar periodos y turnos.',
    points: [
      'Gestión de periodos y turnos.',
      'Visualización de estudiantes inscritos.',
      'Control de estado de inscripciones y documentos.',
    ],
  },
  {
    id: 'soporte',
    title: 'Soporte',
    subtitle: 'Encuentra ayuda rápida si aparece algún error.',
    description: 'Si tienes problemas, revisa los datos ingresados y contacta al soporte de la universidad. El sistema te indicará qué campo necesita corrección.',
    points: [
      'Verifica que todos los campos obligatorios estén completos.',
      'Asegúrate de cargar todos los documentos solicitados.',
      'Si el problema persiste, busca ayuda en la universidad.',
    ],
  },
];

const ManualUsuario = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const currentIndex = sections.findIndex((section) => section.id === activeSection);
  const currentSection = sections[currentIndex];

  return (
    <div className="manual-container">
      <div className="manual-header">
        <h1>Manual de Usuario</h1>
        <p>Guía interactiva para usar el sistema de inscripciones del Consultorio Jurídico.</p>
      </div>

      <div className="manual-layout">
        <aside className="manual-sidebar">
          <div className="manual-sidebar-title">Ir a</div>
          <nav className="manual-sidebar-nav" aria-label="Índice del manual">
            {sections.map((section, index) => (
              <button
                key={section.id}
                type="button"
                className={`manual-sidebar-link ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="manual-sidebar-step">{index + 1}</span>
                {section.title}
              </button>
            ))}
          </nav>
        </aside>

        <main className="manual-main-content">
          <section className="manual-card main-card">
            <div className="manual-card-head">
              <span className="manual-step-badge">{currentIndex + 1}</span>
              <div>
                <h2>{currentSection.title}</h2>
                <p>{currentSection.subtitle}</p>
              </div>
            </div>

            <p className="manual-card-description">{currentSection.description}</p>

            <ul className="manual-card-list">
              {currentSection.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>

            <div className="manual-card-actions">
              <button
                type="button"
                className="manual-action-button"
                onClick={() => setActiveSection(sections[Math.max(0, currentIndex - 1)].id)}
                disabled={currentIndex === 0}
              >
                Anterior
              </button>
              <button
                type="button"
                className="manual-action-button manual-action-button--primary"
                onClick={() => setActiveSection(sections[Math.min(sections.length - 1, currentIndex + 1)].id)}
                disabled={currentIndex === sections.length - 1}
              >
                Siguiente
              </button>
            </div>
          </section>

          <section className="manual-card tips-card">
            <h3>Consejos rápidos</h3>
            <ul>
              <li>Revisa el reglamento antes de comenzar la inscripción.</li>
              <li>Usa un correo institucional válido para avanzar sin errores.</li>
              <li>Vuelve al índice cuando necesites cambiar de sección.</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ManualUsuario;
