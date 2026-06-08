import { useState, useEffect } from 'react'
import './StepForm.css'

// Agregamos la subcarpeta student/ a cada importación
import PersonalInfoForm from '../student/PersonalInfoForm'
import ContactInfoForm from '../student/ContactInfoForm'
import AcademicInfoForm from '../student/AcademicInfoForm'
import LaborInfoForm from '../student/LaborInfoForm'
import AnnexesForm from '../student/AnnexesForm'
import FinalDeclarationsForm from '../student/FinalDeclarationsForm'
import SuccessScreen from '../SuccessScreen/SuccessScreen'
import {
  alertDocumentoDuplicado,
  alertErrorConexion,
  alertErrorInscripcion,
} from '../../utils/swalAlerts'

const STEPS = [
  { id: 1, label: 'INFORMACIÓN PERSONAL' },
  { id: 2, label: 'LUGAR DE RESIDENCIA' },
  { id: 3, label: 'INFORMACIÓN ACADÉMICA' },
  { id: 4, label: 'INFORMACIÓN LABORAL' },
  { id: 5, label: 'ANEXOS' },
  { id: 6, label: 'FINAL' },
]

function StepForm({ onSuccess }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [maxStepReached, setMaxStepReached] = useState(1)
  const [formData, setFormData] = useState({})
  const [nombrePeriodo, setNombrePeriodo] = useState('...')
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    fetch('http://localhost:5000/api/periodos/activo')
      .then(res => {
        if (!res.ok) throw new Error('No hay periodo activo')
        return res.json()
      })
      .then(data => setNombrePeriodo(data.nombre))
      .catch(err => console.error("Error cargando periodo activo:", err))
  }, [])

  const scrollToForm = () => {
    const element = document.getElementById('inscripciones');
    if (element) {
      const yOffset = -80; // Offset para evitar cruce con header pegajoso
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const handleStepChange = (stepId) => {
    if (stepId <= maxStepReached) {
      setCurrentStep(stepId)
      setTimeout(scrollToForm, 50);
    }
  }

  const handleNextStep = (nextStepId) => {
    setMaxStepReached(prev => Math.max(prev, nextStepId))
    setCurrentStep(nextStepId)
    setTimeout(scrollToForm, 50);
  }

  // Guardamos la información que llega desde otros sub-formularios
  const updateFormData = (newData) => {
    setFormData((prev) => {
      const mergedArchivos = {
        ...(prev.archivosSubidos || {}),
        ...(newData.archivosSubidos || {})
      };

      return {
        ...prev,
        ...newData,
        archivosSubidos: Object.keys(mergedArchivos).length ? mergedArchivos : prev.archivosSubidos
      };
    });
  }

  const handleFinalizar = async (finalStepData = {}) => {
    try {
      const mergedData = { ...formData, ...finalStepData };
      // Intenta capturar valores actualmente en pantalla si no se han guardado aún
      const nombres = document.getElementById('pif-nombre')?.value || mergedData.nombres || 'Ejemplo Nombres';
      const documento = document.getElementById('pif-documento')?.value || mergedData.documento || '123456789';
      const email = document.getElementById('pif-email')?.value || mergedData.email || 'ejemplo@correo.com';
      const observacionesPersonales = finalStepData.observaciones_personales
        ?? document.getElementById('fdf-observaciones')?.value?.trim()
        ?? mergedData.observaciones_personales
        ?? '';

      // 1. Usamos FormData en lugar de JSON para enviar texto y Archivos juntos
      const dataAEnviar = new FormData();

      // Textos del paso 1 y otros
      dataAEnviar.append('nombres', nombres);
      dataAEnviar.append('email', email);
      dataAEnviar.append('documento', documento);
      dataAEnviar.append('tipoDoc', mergedData.tipoDoc || 'CC');
      dataAEnviar.append('fechaNacimiento', mergedData.fechaNacimiento || '2000-01-01');
      dataAEnviar.append('semestre', mergedData.semestre || '7');
      dataAEnviar.append('jornada_asignaturas', mergedData.jornada_asignaturas || '');
      dataAEnviar.append('turnoId', mergedData.turnoId || '');

      // Textos del paso de Contacto
      dataAEnviar.append('departamento', mergedData.departamento || '');
      dataAEnviar.append('municipio', mergedData.municipio || '');
      dataAEnviar.append('direccion', mergedData.direccion || '');
      dataAEnviar.append('telefono', mergedData.telefono || '');
      dataAEnviar.append('correoInstitucional', mergedData.correoInstitucional || '');
      dataAEnviar.append('eps', mergedData.eps || '');

      // Textos académicos
      dataAEnviar.append('consultorio_inscrito', mergedData.consultorio_inscrito || 'I');
      dataAEnviar.append('area_interes', mergedData.area_interes || '');
      dataAEnviar.append('consultorios_realizados', mergedData.consultorios_realizados || '0');
      dataAEnviar.append('consultorio_externo', mergedData.consultorio_externo || '0');
      dataAEnviar.append('radicados', mergedData.radicados || '');

      // Textos laborales
      dataAEnviar.append('trabaja', mergedData.trabaja || false);
      dataAEnviar.append('empresa', mergedData.empresa || '');
      dataAEnviar.append('cargo', mergedData.cargo || '');

      // Declaraciones finales
      dataAEnviar.append('observaciones_personales', observacionesPersonales);

      // 2. Archivos (recuperados de mergedData.archivosSubidos ya que el paso 5 está desmontado)
      const archivos = mergedData.archivosSubidos || {};

      if (archivos['anx-identidad']) dataAEnviar.append('doc_identidad', archivos['anx-identidad']);
      if (archivos['anx-eps']) dataAEnviar.append('doc_eps', archivos['anx-eps']);
      if (archivos['anx-consentimiento']) dataAEnviar.append('doc_consentimiento', archivos['anx-consentimiento']);
      if (archivos['anx-acta-compromiso']) dataAEnviar.append('doc_acta', archivos['anx-acta-compromiso']);
      if (archivos['anx-hoja-vida']) dataAEnviar.append('doc_hoja_vida', archivos['anx-hoja-vida']);
      if (archivos['lif-certificacion-funciones']) dataAEnviar.append('doc_certificacion_funciones', archivos['lif-certificacion-funciones']);


      // 3. Enviamos sin { Content-Type: json }
      const respuesta = await fetch('http://localhost:5000/api/estudiantes', {
        method: 'POST',
        body: dataAEnviar
      });

      if (respuesta.ok) {
        const respuestaData = await respuesta.json().catch(() => ({}));
        
        if (onSuccess) {
          // Generamos un radicado basado en el ID de la base de datos si está disponible
          const numRadicado = respuestaData.estudianteId 
            ? `#CJ-${new Date().getFullYear()}-${respuestaData.estudianteId.toString().padStart(4, '0')}`
            : `#CJ-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
            
          onSuccess({ ...mergedData, radicado: numRadicado });
        } else {
          setFormData(mergedData);
          setIsSuccess(true);
        }
      } else {
        const errorData = await respuesta.json();
        const message = errorData.message || 'Error al guardar en el servidor.';

        if (message.includes('documento') && message.includes('registrado')) {
          await alertDocumentoDuplicado();
          setCurrentStep(1);
          setTimeout(scrollToForm, 50);
        } else {
          await alertErrorInscripcion(message);
        }
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      await alertErrorConexion();
    }
  }

  if (isSuccess) {
    return (
      <section className="stepform-section" id="inscripciones">
        <SuccessScreen formData={formData} />
      </section>
    );
  }

  return (
    <section className="stepform-section" id="inscripciones">
      {/* ── Header ── */}
      <div className="stepform-header">
        <h1 className="stepform-title">Inscripción {nombrePeriodo}</h1>
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
          const isClickable = step.id <= maxStepReached

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
                disabled={!isClickable}
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
      {currentStep === 1 && <PersonalInfoForm onNext={() => handleNextStep(2)} onChangeDatos={updateFormData} formData={formData} />}
      {currentStep === 2 && <ContactInfoForm onPrev={() => handleStepChange(1)} onNext={() => handleNextStep(3)} onChangeDatos={updateFormData} formData={formData} />}
      {currentStep === 3 && <AcademicInfoForm onPrev={() => handleStepChange(2)} onNext={() => handleNextStep(4)} onChangeDatos={updateFormData} formData={formData} />}
      {currentStep === 4 && <LaborInfoForm onPrev={() => handleStepChange(3)} onNext={() => handleNextStep(5)} onChangeDatos={updateFormData} formData={formData} />}
      {currentStep === 5 && <AnnexesForm onPrev={() => handleStepChange(4)} onNext={() => handleNextStep(6)} onChangeDatos={updateFormData} formData={formData} />}
      {currentStep === 6 && (
        <FinalDeclarationsForm
          onPrev={() => handleStepChange(5)}
          onSubmitFinal={handleFinalizar}
          onChangeDatos={updateFormData}
          formData={formData}
        />
      )}
    </section>
  )
}

export default StepForm
