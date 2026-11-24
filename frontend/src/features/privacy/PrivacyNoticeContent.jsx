/*
 * Aviso de privacidad del portal.
 *
 * BORRADOR: los textos entre corchetes (resaltados) son datos institucionales que debe
 * completar o validar la Unidad de Transparencia / Oficina del Abogado General de la Unison
 * antes de publicar el portal.
 *
 * Si se cambia el contenido de forma relevante, actualiza LAST_UPDATED y la variable
 * PRIVACY_NOTICE_VERSION del backend: así todos los usuarios deberán aceptarlo de nuevo.
 */

export const LAST_UPDATED = 'noviembre de 2026';

function Pending({ children }) {
  return <mark className="rounded bg-amber-100 px-1 text-amber-900">[{children}]</mark>;
}

function Section({ title, children }) {
  return (
    <section className="space-y-2">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {children}
    </section>
  );
}

// Versión corta para el registro y la pantalla de aceptación.
export function PrivacyNoticeSummary() {
  return (
    <p>
      La Universidad de Sonora utiliza tus datos personales (nombre, expediente, datos de contacto,
      documentos y reportes que registres) para gestionar tu inscripción, asignación y seguimiento en el
      internado médico de pregrado y en el servicio social. Solo se comparten con las sedes e instituciones
      de salud donde realices estos programas y con autoridades cuando la ley lo exija. Puedes ejercer tus
      derechos de acceso, rectificación, cancelación y oposición ante la Unidad de Transparencia.
    </p>
  );
}

function PrivacyNoticeContent() {
  return (
    <div className="space-y-6 text-sm leading-6 text-gray-700">
      <Section title="Responsable">
        <p>
          La Universidad de Sonora, a través del{' '}
          <Pending>Departamento de Medicina y Ciencias de la Salud (Programas de Internado de Pregrado y de Servicio Social)</Pending>,
          con domicilio en{' '}
          <Pending>Blvd. Luis Donaldo Colosio s/n, entre Reforma y Francisco Q. Salazar, edificio 7C, col. Centro, C.P. 83000, Hermosillo, Sonora</Pending>,
          es responsable del tratamiento de los datos personales que se registran en este portal. Contacto:{' '}
          <Pending>medicina@unison.mx · (662) 259 2121, ext. 4550</Pending>.
        </p>
      </Section>

      <Section title="Datos personales que se tratan">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Identificación y contacto:</strong> nombre completo, número de expediente, correo electrónico,
            teléfono y, si decides subirla, fotografía de perfil.
          </li>
          <li>
            <strong>Datos de los programas:</strong> promoción, sede o plaza asignada, estatus de tus solicitudes,
            del internado y del servicio social, y los documentos que subas en cada etapa (por ejemplo, cartas,
            informes, constancias o kárdex).
          </li>
          <li>
            <strong>Reportes de incidentes:</strong> descripción de los hechos, fecha, sede y evidencias que decidas adjuntar.
          </li>
          <li>
            <strong>Datos de acceso:</strong> tu contraseña se guarda cifrada; nadie, ni la coordinación, puede consultarla.
          </li>
        </ul>
        <p>
          <strong>Datos sensibles.</strong> Algunos documentos que piden las convocatorias contienen datos sensibles,
          por ejemplo, certificados médicos, valoraciones psicológicas, resultados de pruebas antidoping, historia
          clínica o informes de salud (sobre todo en las solicitudes de plaza especial o por enfermedad). Un reporte de
          incidente también puede incluirlos (por ejemplo, sobre tu salud o sobre situaciones de violencia o acoso).
          Inclúyelos solo cuando sean necesarios: se tratan con acceso restringido y únicamente para el trámite o
          reporte correspondiente. Al aceptar este aviso otorgas tu consentimiento expreso para ese tratamiento.
        </p>
      </Section>

      <Section title="Finalidades">
        <ol className="list-decimal space-y-1 pl-5">
          <li>Crear y administrar tu cuenta, y verificar que estés pre-registrado como estudiante.</li>
          <li>Gestionar tu inscripción, la asignación de sede o plaza y el seguimiento del internado médico de pregrado y del servicio social.</li>
          <li>Recibir, revisar y resguardar la documentación que se solicita en cada proceso.</li>
          <li>Atender y dar seguimiento a los reportes de incidentes.</li>
          <li>Enviarte avisos y encuestas relacionados con los programas.</li>
          <li>Elaborar estadísticas e informes institucionales, siempre de forma agregada y sin identificarte.</li>
          <li>Proteger tu cuenta, por ejemplo, al restablecer tu contraseña.</li>
        </ol>
        <p>
          Estas finalidades son necesarias para los trámites de los programas. Tus datos no se usan con fines
          comerciales ni para finalidades distintas a las aquí descritas.
        </p>
      </Section>

      <Section title="Fundamento legal">
        <p>
          <Pending>
            Ley Orgánica y Reglamento Escolar de la Universidad de Sonora; normatividad de internado de pregrado y
            servicio social aplicable (p. ej., NOM-033-SSA3-2018 y NOM-009-SSA3-2013); Ley de Protección de Datos
            Personales en Posesión de Sujetos Obligados del Estado de Sonora. Por validar.
          </Pending>
        </p>
      </Section>

      <Section title="Quién puede ver tu información">
        <ul className="list-disc space-y-1 pl-5">
          <li>Tú y el personal de la coordinación con cuenta de administrador en el portal.</li>
          <li>
            Si marcas un reporte como anónimo, la coordinación no verá en el portal quién lo presentó; el vínculo
            con tu cuenta se conserva solo para que puedas consultarlo y darle seguimiento.
          </li>
        </ul>
      </Section>

      <Section title="Transferencias">
        <p>Tus datos solo se comparten:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Con las instituciones de salud y sedes donde realices el internado o el servicio social
            (<Pending>p. ej., Servicios de Salud de Sonora, IMSS, ISSSTE, ISSSTESON</Pending>), únicamente con los
            datos necesarios para tu asignación y seguimiento.
          </li>
          <li>
            Si solicitas una plaza especial o por enfermedad, con las comisiones o comités que la dictaminan
            (<Pending>p. ej., el comité de Servicios de Salud de Sonora / DGEC</Pending>), incluida la documentación médica que entregues.
          </li>
          <li>Con autoridades competentes, cuando una ley o un mandato fundado y motivado lo exija.</li>
        </ul>
      </Section>

      <Section title="Seguridad y conservación">
        <p>
          El acceso al portal requiere usuario y contraseña, cada persona ve solo la información que le corresponde
          según su rol y los documentos solo se descargan con una sesión válida. Los datos se conservan mientras
          participes en los programas y durante el plazo que señalen las disposiciones de archivo de la
          Universidad (<Pending>plazo por definir</Pending>); después se eliminan de forma segura.
        </p>
      </Section>

      <Section title="Derechos ARCO">
        <p>
          Puedes solicitar el acceso, la rectificación, la cancelación o la oposición al tratamiento de tus datos
          personales (derechos ARCO), así como la portabilidad de tus datos. Tu nombre, correo, teléfono y fotografía
          los puedes corregir tú mismo en <strong>Mi perfil</strong>. Para lo demás, presenta tu solicitud ante la
          Unidad de Transparencia de la Universidad de Sonora:{' '}
          <Pending>domicilio, correo electrónico, teléfono y horario de atención</Pending>, o por los medios
          electrónicos que la Universidad habilite para ello (<Pending>p. ej., Plataforma Nacional de Transparencia</Pending>).
        </p>
      </Section>

      <Section title="Cambios a este aviso">
        <p>
          Cualquier cambio se publicará en esta página. Si el cambio es relevante, el portal te pedirá revisarlo
          y aceptarlo de nuevo al iniciar sesión.
        </p>
      </Section>
    </div>
  );
}

export default PrivacyNoticeContent;
