import { useState } from 'react'
import './StepForm.css'
import PersonalInfoForm from './PersonalInfoForm'
import ContactInfoForm from './ContactInfoForm'
import AcademicInfoForm from './AcademicInfoForm'
import LaborInfoForm from './LaborInfoForm'
import AnnexesForm from './AnnexesForm'
import FinalDeclarationsForm from './FinalDeclarationsForm'

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

  const handleStepChange = (stepId) => {
    setCurrentStep(stepId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
      {currentStep === 1 && <PersonalInfoForm onNext={() => handleStepChange(2)} />}
      {currentStep === 2 && <ContactInfoForm onPrev={() => handleStepChange(1)} onNext={() => handleStepChange(3)} />}
      {currentStep === 3 && <AcademicInfoForm onPrev={() => handleStepChange(2)} onNext={() => handleStepChange(4)} />}
      {currentStep === 4 && <LaborInfoForm onPrev={() => handleStepChange(3)} onNext={() => handleStepChange(5)} />}
      {currentStep === 5 && <AnnexesForm onPrev={() => handleStepChange(4)} onNext={() => handleStepChange(6)} />}
      {currentStep === 6 && <FinalDeclarationsForm onPrev={() => handleStepChange(5)} />}
    </section>
  )
}

export default StepForm
