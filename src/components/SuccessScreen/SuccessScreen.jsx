import React from 'react';
import './SuccessScreen.css';

function SuccessScreen({ formData }) {
  // Extract info for the summary
  const nombre = formData.nombres || 'Camilo Andrés Rivas Pardo';
  
  // Get radicado exact from formData or generate a fallback
  const radicado = formData.radicado || `#CJ-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  
  // Get day and time (from formData which gets it from PersonalInfoForm)
  const diaAsignado = formData.diaAsignado || 'Lunes';
  const horario = formData.horarioAsignado || 'Mañana (8:00 AM - 12:00 PM)';
  const consultorio = formData.consultorio_inscrito ? `Consultorio Jurídico ${formData.consultorio_inscrito}` : 'Consultorio Jurídico I';

  const handleDownloadPDF = () => {
    const generatePDF = () => {
      const element = document.getElementById('comprobante-recibo');
      const opt = {
        margin:       1,
        filename:     `Inscripcion_${radicado}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollY: 0 },
        jsPDF:        { unit: 'cm', format: 'letter', orientation: 'portrait' }
      };
      window.html2pdf().set(opt).from(element).save();
    };

    if (window.html2pdf) {
      generatePDF();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = generatePDF;
      document.body.appendChild(script);
    }
  };

  const handleReturnHome = () => {
    window.location.reload();
  };

  return (
    <div className="success-screen-container">
      <div className="success-icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" className="success-icon" aria-hidden="true">
          <circle cx="12" cy="12" r="12" fill="#507B19" />
          <path d="M7 12.5l3.5 3.5 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="success-title">¡Inscripción Exitosa!</h1>
      <p className="success-message">
        Tu solicitud ha sido registrada correctamente en el<br />
        sistema. Hemos enviado un correo de confirmación<br />
        a tu cuenta institucional.
      </p>

      <div id="comprobante-recibo" className="summary-card">
        <div className="summary-card-header">
          <h2>Resumen de Inscripción</h2>
          <span className="badge-confirmed">CONFIRMADO</span>
        </div>

        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">NOMBRE DEL ESTUDIANTE</span>
            <span className="summary-value">{nombre}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">NÚMERO DE RADICADO</span>
            <span className="summary-value radicado-value">{radicado}</span>
          </div>
          
          <div className="summary-item">
            <span className="summary-label">DÍA ASIGNADO</span>
            <span className="summary-value with-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              {diaAsignado}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">HORARIO</span>
            <span className="summary-value with-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              {horario}
            </span>
          </div>

          <div className="summary-item full-width">
            <span className="summary-label">CONSULTORIO</span>
            <span className="summary-value with-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              {consultorio}
            </span>
          </div>
        </div>
      </div>

      <div className="next-steps-section">
        <h3 className="next-steps-title">Próximos Pasos</h3>
        
        <div className="step-item">
          <div className="step-number">1</div>
          <p className="step-text">Revisa tu correo institucional para las instrucciones de la primera inducción.</p>
        </div>
        
        <div className="step-item">
          <div className="step-number">2</div>
          <p className="step-text">Descarga tu comprobante de inscripción para llevar un registro personal.</p>
        </div>
        
        <div className="step-item">
          <div className="step-number">3</div>
          <p className="step-text">Con esta inscripción se gestionará afiliación a la ARL sin la cual no se puede realizar la práctica.</p>
        </div>
      </div>

      <div className="success-actions">
        <button className="btn-primary" onClick={handleDownloadPDF}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Descargar Comprobante (PDF)
        </button>
        <button className="btn-secondary" onClick={handleReturnHome}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}

export default SuccessScreen;
