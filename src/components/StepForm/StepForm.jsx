import { useState } from 'react'
import './StepForm.css'

// Agregamos la subcarpeta student/ a cada importación
import PersonalInfoForm from '../student/PersonalInfoForm'
import ContactInfoForm from '../student/ContactInfoForm'
import AcademicInfoForm from '../student/AcademicInfoForm'
import LaborInfoForm from '../student/LaborInfoForm'
import AnnexesForm from '../student/AnnexesForm'
import FinalDeclarationsForm from '../student/FinalDeclarationsForm'

const STEPS = [
  { id: 1, label: 'INFORMACIÓN PERSONAL' },
  { id: 2, label: 'LUGAR DE RESIDENCIA' },
  { id: 3, label: 'INFORMACIÓN ACADÉMICA' },
  { id: 4, label: 'INFORMACIÓN LABORAL' },
  { id: 5, label: 'ANEXOS' },
  { id: 6, label: 'FINAL' },
]

function StepForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({})

  const handleStepChange = (stepId) => {
    setCurrentStep(stepId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Guardamos la información que llega desde otros sub-formularios
  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }))
  }

  const handleFinalizar = async () => {
    try {
      // Intenta capturar valores actualmente en pantalla si no se han guardado aún
      const nombres = document.getElementById('pif-nombre')?.value || formData.nombres || 'Ejemplo Nombres';
      const documento = document.getElementById('pif-documento')?.value || formData.documento || '123456789';
      const email = document.getElementById('pif-email')?.value || formData.email || 'ejemplo@correo.com';

      // 1. Usamos FormData en lugar de JSON para enviar texto y Archivos juntos
      const dataAEnviar = new FormData();
      
      // Textos del paso 1 y otros
      dataAEnviar.append('nombres', nombres);
      dataAEnviar.append('email', email);
      dataAEnviar.append('documento', documento);
      dataAEnviar.append('tipoDoc', formData.tipoDoc || 'CC');
      dataAEnviar.append('fechaNacimiento', formData.fechaNacimiento || '2000-01-01');
      dataAEnviar.append('semestre', formData.semestre || '7');
      
      // Textos del paso de Contacto
      dataAEnviar.append('departamento', formData.departamento || '');
      dataAEnviar.append('municipio', formData.municipio || '');
      dataAEnviar.append('direccion', formData.direccion || '');
      dataAEnviar.append('telefono', formData.telefono || '');
      dataAEnviar.append('correoInstitucional', formData.correoInstitucional || '');

      // 2. Archivos (recuperados de formData.archivosSubidos ya que el paso 5 está desmontado)
      const archivos = formData.archivosSubidos || {};

      if (archivos['anx-identidad']) dataAEnviar.append('doc_identidad', archivos['anx-identidad']);
      if (archivos['anx-eps']) dataAEnviar.append('doc_eps', archivos['anx-eps']);
      if (archivos['anx-consentimiento']) dataAEnviar.append('doc_consentimiento', archivos['anx-consentimiento']);
      if (archivos['anx-acta-compromiso']) dataAEnviar.append('doc_acta', archivos['anx-acta-compromiso']);
      if (archivos['anx-hoja-vida']) dataAEnviar.append('doc_hoja_vida', archivos['anx-hoja-vida']);

      // 3. Enviamos sin { Content-Type: json }
      const respuesta = await fetch('http://localhost:5000/api/estudiantes', {
        method: 'POST',
        body: dataAEnviar
      });

      if (respuesta.ok) {
        alert("¡Tus datos e información adjunta se registraron correctamente!");
      } else {
        const errorData = await respuesta.json();
        alert(errorData.message || "Error al guardar en el servidor.");
      }
    } catch (error) {
      console.error("Error al registrar:", error);
    }
  }

  return (
    <section className="stepform-section" id="inscripciones">
      {/* ── Header ── */}
      <div className="stepform-header">
        <h1 className="stepform-title">Inscripción Consultorio Jurídico 2026-1</h1>
        <p className="stepform-subtitle">
          Fundación Universitaria del Área Andina &mdash; Límite: 11 estudiantes por día y horario
        </p>
      </div>

      {/* ── Stepper ── */}
      <div className="stepper" role="tablist" aria-label="Pasos del formulario">
        {STEPS.map((step, index) => {
          const isActive = step.id === currentStep
          const isCompleted = step.id < currentStep
          const isLast = index === STEPS.length - 1

          return (
            <div
              key={step.id}
              className={`stepper-item${isActive ? ' is-active' : ''}${isCompleted ? ' is-completed' : ''}`}
            >
              {/* connector line (before every step except the first) */}
              {index > 0 && (
                <div className={`stepper-line stepper-line--before${isCompleted || isActive ? ' is-filled' : ''}`} />
              )}

              {/* circle */}
              <button
                id={`step-btn-${step.id}`}
                className="stepper-circle"
                role="tab"
                aria-selected={isActive}
                aria-label={`Paso ${step.id}: ${step.label}`}
                onClick={() => handleStepChange(step.id)}
              >
                {isCompleted ? (
                  /* checkmark for completed */
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8.5l3.5 3.5 6.5-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  step.id
                )}
              </button>

              {/* connector line (after every step except the last) */}
              {!isLast && (
                <div className={`stepper-line stepper-line--after${isCompleted ? ' is-filled' : ''}`} />
              )}

              {/* label */}
              <span className="stepper-label">{step.label}</span>
            </div>
          )
        })}
      </div>

      {/* ── Mobile Step Indicator ── */}
      <div className="mobile-step-indicator" aria-hidden="true">
        <span className="mobile-step-count">Paso {currentStep} de {STEPS.length}</span>
        <span className="mobile-step-title">{STEPS.find(s => s.id === currentStep)?.label}</span>
      </div>

      {/* ── Contenido del paso activo ── */}
      {currentStep === 1 && <PersonalInfoForm onNext={() => handleStepChange(2)} onChangeDatos={updateFormData} />}
      {currentStep === 2 && <ContactInfoForm onPrev={() => handleStepChange(1)} onNext={() => handleStepChange(3)} onChangeDatos={updateFormData} />}
      {currentStep === 3 && <AcademicInfoForm onPrev={() => handleStepChange(2)} onNext={() => handleStepChange(4)} onChangeDatos={updateFormData} />}
      {currentStep === 4 && <LaborInfoForm onPrev={() => handleStepChange(3)} onNext={() => handleStepChange(5)} onChangeDatos={updateFormData} />}
      {currentStep === 5 && <AnnexesForm onPrev={() => handleStepChange(4)} onNext={() => handleStepChange(6)} onChangeDatos={updateFormData} />}
      {currentStep === 6 && <FinalDeclarationsForm onPrev={() => handleStepChange(5)} onSubmitFinal={handleFinalizar} />}
    </section>
  )
}

export default StepForm
