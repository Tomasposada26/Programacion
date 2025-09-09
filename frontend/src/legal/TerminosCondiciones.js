import React from 'react';
import logoAura from '../assets/logo-aura.png';
import { TerminosIcon } from '../assets/LegalIcons';
import { PdfIcon } from '../assets/PdfIcon';
import { useNavigate, useLocation } from 'react-router-dom';
import './TerminosCondiciones.css';
import { Link } from 'react-router-dom';

const TerminosCondiciones = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Función para descargar PDF
  const handleDownloadPDF = () => {
    import('jspdf').then(jsPDFModule => {
      import('html2canvas').then(html2canvasModule => {
        const jsPDF = jsPDFModule.default;
        const html2canvas = html2canvasModule.default;
        const input = document.querySelector('.terminos-content');
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
          pdf.save('Terminos_y_Condiciones_Aura.pdf');
        });
      });
    });
  };

  return (
    <div className="terminos-container">
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
      <header className="terminos-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div className="terminos-header-left">
          <img src={logoAura} alt="Logo Aura" className="terminos-logo" />
          <TerminosIcon size={40} />
        </div>
        <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
          <button
            className="terminos-pdf-btn"
            style={{display:'flex', alignItems:'center', gap:'6px'}}
            onClick={handleDownloadPDF}
            title="Descargar PDF"
          >
            <PdfIcon size={36} />
          </button>
          <button className="terminos-back-btn" onClick={() => navigate('/')}> <span className="back-icon">←</span> Volver a Aura</button>
        </div>
      </header>
      <main className="terminos-content">
        <nav className="legal-breadcrumbs">
          <Link to="/">Inicio</Link>
          <span className="breadcrumb-sep">/</span>
          <span>Términos y Condiciones</span>
        </nav>
        <h1>Términos y Condiciones de Uso de Aura</h1>
        <hr />
        <p><strong>Fecha de entrada en vigor:</strong> 5 de septiembre de 2025</p>
        <p>Por favor, lee atentamente estos Términos y Condiciones antes de utilizar los servicios de Aura. Al acceder o utilizar la plataforma, el usuario reconoce haber leído, entendido y aceptado íntegramente estos Términos. En caso de no estar de acuerdo, deberá abstenerse de usar los servicios.</p>
        <h2>1. Definiciones</h2>
        <ul>
          <li><strong>“Aura”:</strong> hace referencia a la plataforma, sitio web, aplicación y demás servicios digitales desarrollados y gestionados por Aura.</li>
          <li><strong>“Usuario”:</strong> cualquier persona que acceda, se registre o utilice los servicios de Aura.</li>
          <li><strong>“Contenido”:</strong> toda información, texto, gráficos, imágenes, software, código fuente, bases de datos y cualquier otro material disponible en la plataforma.</li>
        </ul>
        <h2>2. Condiciones de uso del servicio</h2>
        <ul>
          <li>Aura está destinado a usuarios mayores de 18 años. Los menores de edad solo podrán utilizar el servicio con autorización y supervisión de sus padres o tutores legales.</li>
          <li>El usuario se compromete a proporcionar información veraz, actualizada y completa al registrarse.</li>
          <li>El usuario es responsable de la confidencialidad de sus credenciales de acceso y de todas las actividades realizadas desde su cuenta.</li>
          <li>Aura se reserva el derecho de verificar la identidad y la información de los usuarios en cualquier momento.</li>
        </ul>
        <h2>3. Propiedad intelectual</h2>
        <ul>
          <li>Todo el contenido, marcas registradas, logotipos, software, diseños, interfaces, bases de datos y demás elementos de Aura son propiedad exclusiva de Aura o de sus licenciantes, y están protegidos por las leyes de propiedad intelectual nacionales e internacionales.</li>
          <li>El usuario recibe una licencia limitada, no exclusiva, intransferible y revocable para acceder y utilizar Aura únicamente con fines personales y no comerciales.</li>
          <li>Está prohibido copiar, reproducir, modificar, distribuir, vender, licenciar, alquilar o explotar cualquier parte de Aura sin autorización expresa y por escrito.</li>
          <li>Al subir o publicar contenido en Aura, el usuario otorga a Aura una licencia no exclusiva, gratuita, mundial y limitada para alojar, mostrar y procesar dicho contenido únicamente con el fin de prestar el servicio.</li>
        </ul>
        <h2>4. Conducta del usuario</h2>
        <ul>
          <li>No utilizar Aura para actividades ilegales, fraudulentas o que infrinjan derechos de terceros.</li>
          <li>No cargar, transmitir o difundir virus, malware o cualquier código malicioso.</li>
          <li>No acosar, difamar, amenazar ni vulnerar los derechos de otros usuarios.</li>
          <li>No intentar acceder sin autorización a sistemas, cuentas, servidores o bases de datos de Aura.</li>
          <li>No usar herramientas automatizadas (bots, scrapers, crawlers) que afecten el funcionamiento del servicio.</li>
        </ul>
        <h2>5. Disponibilidad y modificaciones del servicio</h2>
        <ul>
          <li>Aura no garantiza la disponibilidad ininterrumpida del servicio, el cual puede estar sujeto a interrupciones, actualizaciones o limitaciones técnicas.</li>
          <li>Aura se reserva el derecho de modificar, suspender o descontinuar total o parcialmente el servicio en cualquier momento, sin responsabilidad frente al usuario.</li>
        </ul>
        <h2>6. Suspensión y terminación de cuentas</h2>
        <ul>
          <li>Aura podrá suspender o cancelar temporal o permanentemente la cuenta de un usuario en caso de incumplimiento de estos Términos, actividades sospechosas, fraudulentas o que representen riesgo para la seguridad.</li>
          <li>El usuario puede cancelar su cuenta en cualquier momento enviando una solicitud a soporte mediante el correo: <a href="mailto:aurainstacms@gmail.com">aurainstacms@gmail.com</a>.</li>
          <li>La cancelación de la cuenta no exime al usuario de responsabilidades legales pendientes.</li>
        </ul>
        <h2>7. Limitación de responsabilidad</h2>
        <ul>
          <li>Aura proporciona sus servicios “tal cual” y “según disponibilidad”, sin garantías de ningún tipo, expresas o implícitas.</li>
          <li>Aura no se responsabiliza por daños directos, indirectos, incidentales, especiales, consecuenciales o punitivos derivados del uso o imposibilidad de uso del servicio.</li>
          <li>El usuario entiende y acepta que utiliza Aura bajo su propio riesgo y que la plataforma no garantiza resultados específicos.</li>
          <li>En la medida máxima permitida por la ley, la responsabilidad total de Aura frente a cualquier reclamación no superará el valor total pagado por el usuario en los últimos 12 meses (si aplica).</li>
        </ul>
        <h2>8. Modificaciones de los Términos</h2>
        <p>Aura se reserva el derecho de modificar o actualizar estos Términos en cualquier momento. En caso de cambios sustanciales, se notificará al usuario a través de medios oficiales antes de su entrada en vigor. El uso continuado del servicio tras la notificación constituirá aceptación de las modificaciones.</p>
        <h2>9. Ley aplicable y jurisdicción</h2>
        <p>Estos Términos se rigen por las leyes de la República de Colombia, sin perjuicio de la aplicación de normativas internacionales de protección al consumidor o protección de datos que puedan corresponder.</p>
        <p>Cualquier disputa derivada de la interpretación o ejecución de estos Términos será sometida a los tribunales competentes de la ciudad de Medellín, Colombia.</p>
        <h2>10. Independencia de cláusulas</h2>
        <p>Si alguna disposición de estos Términos es considerada inválida o inaplicable, las disposiciones restantes permanecerán en pleno vigor y efecto.</p>
        <h2>11. Contacto</h2>
        <p>Para consultas, reclamaciones o solicitudes relacionadas con estos Términos y Condiciones, puedes escribirnos a: <a href="mailto:aurainstacms@gmail.com">aurainstacms@gmail.com</a></p>
      </main>
    </div>
  );
};

export default TerminosCondiciones;
