import React, { useRef } from 'react';
import logoAura from '../assets/logo-aura.png';
import { EliminacionIcon } from '../assets/LegalIcons';
import { PdfIcon } from '../assets/PdfIcon';
import { useNavigate, useLocation } from 'react-router-dom';
import './PoliticasEliminacion.css';
import { Link } from 'react-router-dom';

const PoliticasEliminacion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const contentRef = useRef();

  // Función para descargar PDF
  const handleDownloadPDF = () => {
    import('jspdf').then(jsPDFModule => {
      import('html2canvas').then(html2canvasModule => {
        const jsPDF = jsPDFModule.default;
        const html2canvas = html2canvasModule.default;
        const input = contentRef.current;
        if (!input) return;
        html2canvas(input, { scale: 2, useCORS: true, backgroundColor: '#fff' }).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pageWidth;
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          let position = 0;
          let remainingHeight = pdfHeight;
          while (remainingHeight > 0) {
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            remainingHeight -= pageHeight;
            if (remainingHeight > 0) {
              pdf.addPage();
              position -= pageHeight;
            }
          }
          pdf.save('Politica_de_Eliminacion_Aura.pdf');
        });
      });
    });
  };

  return (
    <div className="eliminacion-container">
      <nav style={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center', margin:'16px 0 8px 0', fontSize:'0.98rem', gap:0}}>
        <Link to="/politicasdeprivacidad" style={{
          color: location.pathname === '/politicasdeprivacidad' ? '#1976d2' : '#232a3b',
          fontWeight: location.pathname === '/politicasdeprivacidad' ? 700 : 500,
          textDecoration: 'none',
          padding: '0 8px',
          borderBottom: location.pathname === '/politicasdeprivacidad' ? '2px solid #1976d2' : '2px solid transparent',
          paddingBottom: 1
        }}>Políticas de Privacidad</Link>
        <span style={{color:'#b0b0b0', fontWeight:400, fontSize:'1.1em'}}>|</span>
        <Link to="/terminosycondiciones" style={{
          color: location.pathname === '/terminosycondiciones' ? '#1976d2' : '#232a3b',
          fontWeight: location.pathname === '/terminosycondiciones' ? 700 : 500,
          textDecoration: 'none',
          padding: '0 8px',
          borderBottom: location.pathname === '/terminosycondiciones' ? '2px solid #1976d2' : '2px solid transparent',
          paddingBottom: 1
        }}>Términos y Condiciones</Link>
        <span style={{color:'#b0b0b0', fontWeight:400, fontSize:'1.1em'}}>|</span>
        <Link to="/politicasdeeliminacion" style={{
          color: location.pathname === '/politicasdeeliminacion' ? '#1976d2' : '#232a3b',
          fontWeight: location.pathname === '/politicasdeeliminacion' ? 700 : 500,
          textDecoration: 'none',
          padding: '0 8px',
          borderBottom: location.pathname === '/politicasdeeliminacion' ? '2px solid #1976d2' : '2px solid transparent',
          paddingBottom: 1
        }}>Políticas de Eliminación</Link>
      </nav>
      <header className="eliminacion-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div className="eliminacion-header-left">
          <img src={logoAura} alt="Logo Aura" className="eliminacion-logo" />
          <EliminacionIcon size={40} />
        </div>
        <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
          <button
            className="eliminacion-pdf-btn"
            style={{display:'flex', alignItems:'center', gap:'6px'}}
            onClick={handleDownloadPDF}
            title="Descargar PDF"
          >
            <PdfIcon size={36} />
          </button>
          <button className="eliminacion-back-btn" onClick={() => navigate('/')}> <span className="back-icon">←</span> Volver a Aura</button>
        </div>
      </header>
      <main className="eliminacion-content" ref={contentRef}>
        <nav className="legal-breadcrumbs">
          <Link to="/">Inicio</Link>
          <span className="breadcrumb-sep">/</span>
          <span>Políticas de Eliminación</span>
        </nav>
        <h1>Política de Eliminación de Datos de Aura</h1>
        <p><strong>Fecha de entrada en vigor:</strong> 5 de septiembre de 2025</p>
        <p>En Aura, respetamos el derecho de nuestros usuarios a la privacidad y al control de su información personal. Esta Política establece los procedimientos y condiciones bajo las cuales puedes solicitar la eliminación de tus datos personales de nuestros sistemas.</p>
        <h2>1. Alcance de la eliminación</h2>
        <ul>
          <li>Información de registro de cuenta (nombre, correo electrónico, contraseña).</li>
          <li>Preferencias, configuraciones y actividad en la plataforma.</li>
          <li>Interacciones, historiales y cualquier información asociada a tu perfil.</li>
          <li>Copias de seguridad relacionadas, las cuales serán eliminadas de manera progresiva dentro de los plazos de retención técnica.</li>
        </ul>
        <h2>2. Solicitud de eliminación</h2>
        <ul>
          <li>Puedes solicitar la eliminación de tu cuenta y de tus datos personales en cualquier momento.</li>
          <li>Para hacerlo, deberás enviar una solicitud desde la dirección de correo electrónico asociada a tu cuenta a: <a href="mailto:aurainstacms@gmail.com">aurainstacms@gmail.com</a>.</li>
          <li>Aura podrá requerir información adicional para verificar tu identidad y evitar solicitudes fraudulentas.</li>
        </ul>
        <h2>3. Proceso de eliminación</h2>
        <ul>
          <li>Una vez recibida tu solicitud y verificada tu identidad, procederemos a eliminar tus datos personales de nuestros sistemas.</li>
          <li>El proceso de eliminación se completará en un plazo máximo de 30 días calendario.</li>
          <li>Una vez finalizada la eliminación, recibirás una confirmación al correo electrónico registrado.</li>
          <li>Los datos eliminados no podrán ser recuperados por el usuario.</li>
        </ul>
        <h2>4. Excepciones a la eliminación</h2>
        <ul>
          <li>Cumplimiento legal y regulatorio: cuando la ley nos obligue a mantener cierta información (ejemplo: registros contables, facturación, obligaciones tributarias).</li>
          <li>Seguridad y prevención de fraudes: para detectar abusos, fraudes o actividades ilegales.</li>
          <li>Resolución de disputas y defensa de derechos: cuando sea necesario para responder a reclamaciones o proteger derechos de Aura o terceros.</li>
          <li>Obligaciones contractuales: cuando la conservación de datos sea necesaria para la ejecución de un contrato vigente.</li>
        </ul>
        <p>En todos los casos, los datos retenidos se limitarán estrictamente a lo necesario y se eliminarán una vez cumplida la finalidad legal.</p>
        <h2>5. Eliminación de datos de terceros</h2>
        <ul>
          <li>Si proporcionaste datos de terceros a través de Aura, garantizas que cuentas con su consentimiento expreso para solicitar su eliminación. Aura podrá rechazar solicitudes que no cumplan con este requisito.</li>
        </ul>
        <h2>6. Relación con la Política de Privacidad</h2>
        <p>Esta Política de Eliminación forma parte integral de la Política de Privacidad de Aura y debe interpretarse de manera conjunta. En caso de conflicto, prevalecerán las disposiciones legales aplicables en materia de protección de datos.</p>
        <h2>7. Contacto</h2>
        <p>Para consultas o solicitudes relacionadas con la eliminación de datos, puedes contactarnos en: <a href="mailto:aurainstacms@gmail.com">aurainstacms@gmail.com</a></p>
      </main>
    </div>
  );
};

export default PoliticasEliminacion;
