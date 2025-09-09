import React from 'react';
import logoAura from '../assets/logo-aura.png';
import { PrivacidadIcon } from '../assets/LegalIcons';
import { PdfIcon } from '../assets/PdfIcon';
import { useNavigate, useLocation } from 'react-router-dom';
import './PoliticasPrivacidad.css';
import { Link } from 'react-router-dom';

const PoliticasPrivacidad = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Función para descargar PDF
  const handleDownloadPDF = () => {
    import('jspdf').then(jsPDFModule => {
      import('html2canvas').then(html2canvasModule => {
        const jsPDF = jsPDFModule.default;
        const html2canvas = html2canvasModule.default;
        const input = document.querySelector('.privacidad-content');
        if (!input) return;
        html2canvas(input, { scale: 2 }).then(canvas => {
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
          pdf.save('Politica_de_Privacidad_Aura.pdf');
        });
      });
    });
  };

  return (
    <div className="privacidad-container">
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
      <header className="privacidad-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div className="privacidad-header-left">
          <img src={logoAura} alt="Logo Aura" className="privacidad-logo" />
          <PrivacidadIcon size={40} />
        </div>
        <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
          <button
            className="privacidad-pdf-btn"
            style={{display:'flex', alignItems:'center', gap:'6px'}}
            onClick={handleDownloadPDF}
            title="Descargar PDF"
          >
            <PdfIcon size={36} />
          </button>
          <button className="privacidad-back-btn" onClick={() => navigate('/')}> <span className="back-icon">←</span> Volver a Aura</button>
        </div>
      </header>
      <main className="privacidad-content">
        <nav className="legal-breadcrumbs">
          <Link to="/">Inicio</Link>
          <span className="breadcrumb-sep">/</span>
          <span>Políticas de Privacidad</span>
        </nav>
        <h1>Política de Privacidad de Aura</h1>
        <hr />
        <p><strong>Fecha de entrada en vigor:</strong> 5 de septiembre de 2025</p>
        <p>En Aura, nos comprometemos a proteger la privacidad y seguridad de la información personal de nuestros usuarios. Esta Política de Privacidad describe de manera clara y transparente cómo recopilamos, usamos, almacenamos, compartimos y protegemos tus datos personales cuando utilizas nuestros servicios.</p>
        <p>Al acceder o utilizar Aura, aceptas las prácticas descritas en esta Política de Privacidad.</p>
        <h2>1. Información que recopilamos</h2>
        <ul>
          <li><strong>Datos de registro:</strong> nombre, correo electrónico, contraseña y cualquier información necesaria para crear y gestionar una cuenta.</li>
          <li><strong>Datos de uso:</strong> información sobre tus interacciones dentro de la plataforma, mensajes, configuraciones, preferencias y actividad de navegación.</li>
          <li><strong>Datos técnicos:</strong> dirección IP, tipo y modelo de dispositivo, sistema operativo, navegador, identificadores únicos, cookies y tecnologías similares.</li>
          <li><strong>Datos opcionales:</strong> información adicional que decidas proporcionar de manera voluntaria, como foto de perfil, biografía u otros datos.</li>
        </ul>
        <h2>2. Finalidad y uso de la información</h2>
        <ul>
          <li>Proveer, operar y mejorar nuestros servicios.</li>
          <li>Personalizar la experiencia del usuario en Aura.</li>
          <li>Gestionar notificaciones, comunicaciones y soporte al cliente.</li>
          <li>Garantizar la seguridad, prevención del fraude y cumplimiento de nuestras políticas.</li>
          <li>Cumplir con obligaciones legales, regulatorias y de seguridad.</li>
          <li>Analizar métricas y realizar estudios de usabilidad para optimizar el servicio.</li>
        </ul>
        <h2>3. Cookies y tecnologías similares</h2>
        <ul>
          <li>Recordar tus preferencias y configuración.</li>
          <li>Analizar tendencias de uso y tráfico.</li>
          <li>Ofrecer contenido personalizado y relevante.</li>
        </ul>
        <p>Puedes configurar tu navegador para rechazar cookies; sin embargo, algunas funciones del servicio pueden verse limitadas.</p>
        <h2>4. Compartición de la información</h2>
        <ul>
          <li><strong>Proveedores de servicios:</strong> terceros que nos ayudan a operar la plataforma (alojamiento, mantenimiento, análisis de datos, soporte, etc.), bajo estrictos acuerdos de confidencialidad.</li>
          <li><strong>Cumplimiento legal:</strong> cuando sea necesario para cumplir con leyes, procesos legales, órdenes judiciales o requerimientos de autoridades competentes.</li>
          <li><strong>Consentimiento del usuario:</strong> en los casos en que el usuario lo autorice de manera explícita.</li>
          <li><strong>Transferencias internacionales:</strong> si tus datos se almacenan o procesan fuera de tu país, garantizamos que existan mecanismos adecuados de protección (como cláusulas contractuales estándar o equivalentes).</li>
        </ul>
        <h2>5. Seguridad de los datos</h2>
        <p>Implementamos medidas técnicas, administrativas y organizativas para proteger tu información frente a accesos no autorizados, alteración, divulgación o destrucción. No obstante, ningún sistema es 100 % seguro; el usuario también debe tomar medidas para proteger sus credenciales y dispositivos.</p>
        <h2>6. Derechos de los usuarios</h2>
        <p>De acuerdo con la legislación aplicable (incluyendo la Ley 1581 de 2012 en Colombia, el Reglamento General de Protección de Datos de la Unión Europea –GDPR– y demás normativas locales), los usuarios tienen derecho a:</p>
        <ul>
          <li>Acceder a sus datos personales.</li>
          <li>Rectificar información inexacta o desactualizada.</li>
          <li>Eliminar sus datos cuando no sean necesarios o se retire el consentimiento.</li>
          <li>Oponerse al tratamiento o solicitar su limitación.</li>
          <li>Solicitar la portabilidad de sus datos a otro proveedor de servicios.</li>
        </ul>
        <p>Para ejercer estos derechos, el usuario puede contactarnos al correo: <a href="mailto:aurainstacms@gmail.com">aurainstacms@gmail.com</a>. Daremos respuesta dentro de los plazos establecidos por la ley aplicable.</p>
        <h2>7. Retención de datos</h2>
        <p>Los datos se conservarán únicamente durante el tiempo necesario para cumplir con las finalidades descritas en esta Política y con obligaciones legales. Una vez cumplidos estos fines, los datos serán eliminados o anonimizados de forma segura.</p>
        <h2>8. Responsabilidad del usuario</h2>
        <ul>
          <li>Proveer información veraz y actualizada al registrarse.</li>
          <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
          <li>Notificar de inmediato cualquier uso no autorizado de su cuenta.</li>
        </ul>
        <h2>9. Cambios en esta política</h2>
        <p>Podemos actualizar esta Política de Privacidad para reflejar cambios legales, técnicos o de negocio. Notificaremos dichos cambios a través de nuestros canales oficiales antes de su entrada en vigor.</p>
        <h2>10. Contacto</h2>
        <p>Si tienes preguntas, comentarios o inquietudes sobre esta Política de Privacidad, puedes escribirnos a: <a href="mailto:aurainstacms@gmail.com">aurainstacms@gmail.com</a></p>
      </main>
    </div>
  );
};

export default PoliticasPrivacidad;
