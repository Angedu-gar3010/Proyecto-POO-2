// Cada entrada contiene:
// nombre, tipo, caso fraudulento, caso legítimo y dos señales.

export const catalogoNiveles = {
  ESTUDIANTE: [
    ['Becas y mensajes estudiantiles', 'MENSAJE',
      'Ganaste una beca que no solicitaste. Paga una cuota a esta cuenta personal en diez minutos; no consultes al centro educativo.',
      'Entraste escribiendo la dirección oficial de tu centro educativo. Allí publicaron los requisitos de becas y un contacto institucional para resolver dudas, sin solicitar pagos.',
      ['Pide un pago a una cuenta personal', 'Presiona para actuar sin consultar']],

    ['Acceso al campus virtual', 'EMAIL',
      'Tu campus será eliminado hoy. Responde este correo con tu usuario y contraseña para conservar las tareas.',
      'Abriste tu marcador verificado del campus y consultaste las tareas. El aviso explica el mantenimiento programado y no pide enviar credenciales.',
      ['Solicita la contraseña por correo', 'Amenaza con eliminar el acceso inmediatamente']],

    ['Grupos de clase', 'MENSAJE',
      'Soy el nuevo coordinador del grupo. Envíame el código de verificación de WhatsApp que acabas de recibir; no hace falta confirmar con tu profesor.',
      'Tu profesor confirmó en clase un grupo de estudio. El mensaje del grupo publica horarios y no solicita códigos ni contraseñas.',
      ['Solicita un código de verificación', 'Evita confirmar la identidad con el profesor']],

    ['Compra de libros', 'RED_SOCIAL',
      'Vendo todos los libros a mitad de precio. Deposita ahora fuera de la plataforma; no acepto entrega presencial ni mostrar los libros.',
      'En la librería que visitaste y conoces puedes revisar el libro, conocer el precio y pagar al recibirlo con comprobante.',
      ['Exige pagar fuera de la plataforma', 'Se niega a mostrar el producto']],

    ['Prácticas y primer empleo', 'EMAIL',
      'Estás contratado sin entrevista. Envía una cuota a mi cuenta personal para reservar tu plaza antes de esta noche.',
      'La oficina de prácticas de tu institución confirmó una convocatoria. La empresa invita a una entrevista por sus canales verificados y no cobra por participar.',
      ['Cobra por reservar un empleo', 'Ofrece contratación sin entrevista']],

    ['Sorteos y videojuegos', 'RED_SOCIAL',
      'Ganaste una consola en un sorteo al que nunca entraste. Para reclamarla, envía la contraseña de tu cuenta de juegos y paga el envío de inmediato.',
      'Dentro de la aplicación oficial del juego consultas las reglas de un torneo abierto. No se solicita compartir tu contraseña ni hacer pagos para reclamar premios.',
      ['Anuncia un premio no solicitado', 'Pide la contraseña de una cuenta']],

    ['Archivos de apuntes', 'ARCHIVO',
      'Descarga apuntes.pdf.exe desde este mensaje de un desconocido. Si el antivirus lo bloquea, desactívalo para abrir el resumen.',
      'Tu docente publicó un PDF en el aula virtual verificada. Puedes leerlo en el visor del campus sin instalar programas ni desactivar protecciones.',
      ['El supuesto PDF termina en .exe', 'Pide desactivar el antivirus']],

    ['Códigos QR en el campus', 'ENLACE',
      'Un adhesivo sobre el cartel oficial dice: escanea este QR para pagar la matrícula en una cuenta personal. No uses la caja del centro.',
      'En la caja de tu centro confirmaste el importe y el canal oficial de pago. Puedes recibir un comprobante y consultar al personal antes de pagar.',
      ['El adhesivo reemplaza información del cartel oficial', 'Desvía el pago a una cuenta personal']],

    ['Redes Wi-Fi públicas', 'SITIO_WEB',
      'La red Gratis_Estudiantes pide instalar un certificado desconocido e ingresar tu contraseña bancaria para tener internet.',
      'El personal de la biblioteca confirmó el nombre de su red. La pantalla de acceso presenta las normas de uso sin pedir credenciales bancarias ni instalar certificados.',
      ['Solicita una contraseña bancaria para usar Wi-Fi', 'Exige instalar un certificado desconocido']],

    ['Venta de entradas', 'RED_SOCIAL',
      'Tengo la última entrada del concierto. Transfiere ahora; no puedo mostrar la entrada ni usar una plataforma con protección al comprador.',
      'Compras directamente en la taquilla oficial anunciada por el organizador, con precio visible y comprobante de compra.',
      ['Se niega a demostrar que tiene la entrada', 'Exige una transferencia sin protección al comprador']],

    ['Suplantación de amistades', 'MENSAJE',
      'Soy tu compañero desde otro número. Necesito dinero ya. No me llames ni preguntes a nadie de la clase.',
      'Tu compañero organiza un trabajo grupal mediante el contacto habitual. Confirmaron la reunión en persona y no solicita dinero ni datos personales.',
      ['Usa un número nuevo sin verificar su identidad', 'Impide confirmar la solicitud por otra vía']],

    ['Cursos y certificados', 'SITIO_WEB',
      'Obtén un título oficial en una hora sin estudiar. Paga hoy a una cuenta personal; no mostramos institución acreditadora ni datos de contacto.',
      'Consultaste el sitio oficial de una institución conocida. El curso informa contenidos, duración, costos y canales verificables antes de inscribirte.',
      ['Promete un título sin formación ni evaluación', 'Oculta la institución responsable']],

    ['Aplicaciones de estudio', 'MENSAJE',
      'Instala este APK de una fuente desconocida para estudiar. Activa acceso a SMS y accesibilidad, aunque la aplicación solo ofrece tarjetas de memoria.',
      'En la tienda oficial revisaste al desarrollador y los permisos de una aplicación de estudio. Permite practicar sin acceso a mensajes ni controles de accesibilidad.',
      ['Distribuye un APK desde una fuente desconocida', 'Solicita permisos ajenos a la función de estudio']],

    ['Recuperación de cuentas', 'EMAIL',
      'Somos recuperación de cuentas. Mándanos tu contraseña y todos tus códigos de respaldo por este correo para demostrar que eres el dueño.',
      'Iniciaste la recuperación desde el sitio oficial que escribiste tú. El proceso permite cambiar la contraseña allí y no pide enviarla por correo.',
      ['Solicita enviar la contraseña por correo', 'Pide entregar todos los códigos de respaldo']],

    ['Protección de documentos', 'MENSAJE',
      'Para entregarte una ayuda estudiantil no solicitada, envía una foto de tu documento por ambos lados y de tu tarjeta bancaria a este número desconocido.',
      'En la oficina de tu institución verificaste los requisitos de una solicitud que tú iniciaste. El personal explica qué documentos necesita y no solicita fotos de tarjetas bancarias.',
      ['Ofrece una ayuda que no solicitaste', 'Pide documentos y una tarjeta bancaria por un contacto desconocido']],
  ],

  PERSONAL_ADMINISTRATIVO: [
    ['Correos y pagos administrativos', 'EMAIL',
      'Soy la dirección. Transfiere hoy a una cuenta nueva sin pasar por aprobación. No me llames: esta operación es secreta.',
      'En el sistema interno verificado hay una orden de compra con aprobaciones registradas. Puedes contrastarla con el proveedor por el contacto habitual antes de pagar.',
      ['Exige saltarse las aprobaciones', 'Prohíbe verificar una nueva cuenta bancaria']],

    ['Facturas de proveedores', 'EMAIL',
      'Adjunto una factura de una compra sin orden registrada. Págala hoy o suspenderemos el servicio; no podemos proporcionar detalle del pedido.',
      'El proveedor habitual envió una factura cuyo número, importe y productos coinciden con la orden aprobada y la recepción documentada.',
      ['No existe una orden de compra que respalde la factura', 'Presiona para pagar sin proporcionar detalles']],

    ['Cambios de cuenta bancaria', 'EMAIL',
      'Nuestro banco cambió. Usa esta cuenta desde hoy y verifica únicamente respondiendo a este mismo correo; no llames al contacto registrado.',
      'Recibiste un aviso de cambio y lo confirmaste llamando al número del proveedor que ya estaba en tu directorio. Se siguió el procedimiento interno de autorización.',
      ['Solicita cambiar el destino de un pago', 'Impide verificar mediante un contacto previamente conocido']],

    ['Documentos compartidos', 'ENLACE',
      'Para ver el acta entra a https://documentos-empresa.example e introduce la contraseña corporativa. El remitente es desconocido y no esperabas este archivo.',
      'Desde el gestor documental corporativo abierto con tu marcador verificado revisas un acta anunciada previamente por tu equipo.',
      ['El documento no era esperado y viene de un desconocido', 'Solicita credenciales corporativas en un sitio externo']],

    ['Nóminas y datos sensibles', 'MENSAJE',
      'Soy de recursos humanos desde este número nuevo. Envíame por chat la nómina completa con cuentas bancarias; no abras una solicitud interna.',
      'La persona responsable registrada solicitó un reporte por el sistema autorizado, con finalidad y permisos documentados, usando el procedimiento habitual.',
      ['Pide datos bancarios masivos por chat', 'Solicita evitar el procedimiento interno']],

    ['Suplantación de soporte', 'MENSAJE',
      'Somos soporte urgente. Dinos tu contraseña y el código de doble factor. No podemos darte un número de ticket ni confirmar con tu departamento.',
      'Abriste un ticket en la mesa de ayuda oficial. El técnico identificado guía la revisión sin solicitar tu contraseña ni códigos de autenticación.',
      ['Solicita contraseña y código de doble factor', 'No permite verificar la identidad mediante un ticket']],

    ['Adjuntos y macros', 'ARCHIVO',
      'Abre factura.xlsm de este proveedor desconocido. Activa todas las macros y deshabilita la protección para poder leer el importe.',
      'En el portal verificado del proveedor descargas una factura PDF que puede abrirse sin ejecutar macros ni desactivar protecciones.',
      ['Pide ejecutar macros de una fuente desconocida', 'Exige deshabilitar la protección']],

    ['Compras urgentes', 'EMAIL',
      'Soy tu jefe. Compra tarjetas de regalo con fondos de la oficina y envíame sus códigos ahora. No lo comentes con compras.',
      'La jefatura registró una solicitud de materiales en el sistema de compras con presupuesto y aprobación, sin pedir tarjetas de regalo ni códigos.',
      ['Pide tarjetas de regalo y sus códigos', 'Solicita ocultar la operación al área de compras']],

    ['Notificaciones tributarias', 'EMAIL',
      'Tiene una multa que vence en una hora. Deposítela en esta cuenta personal para evitar una captura; no consulte su expediente oficial.',
      'Accediste por tu cuenta al portal oficial correspondiente y consultaste una notificación con expediente verificable y canales institucionales de atención.',
      ['Solicita pagar una multa en una cuenta personal', 'Amenaza y evita la consulta del expediente']],

    ['Reservas y viajes laborales', 'SITIO_WEB',
      'Encontraste una agencia sin dirección verificable que exige pagar fuera del sistema corporativo y se niega a emitir comprobante de reserva.',
      'La agencia autorizada por la organización entrega itinerario, condiciones y comprobante mediante el procedimiento de viajes aprobado.',
      ['Exige pagar fuera del sistema autorizado', 'Se niega a entregar comprobante de reserva']],

    ['Firmas electrónicas', 'EMAIL',
      'Para firmar el contrato envíame el archivo de tu certificado y su contraseña por correo. No necesitas leer el documento.',
      'En la plataforma de firma autorizada revisas el contrato completo y firmas tú mismo sin entregar tu certificado ni su contraseña a terceros.',
      ['Solicita el certificado y su contraseña', 'Intenta evitar la revisión del documento']],

    ['Cambios de datos de empleados', 'EMAIL',
      'Cambia mi cuenta de nómina: escribo desde una dirección externa nueva. No puedo cumplir la verificación de identidad, pero debes hacerlo hoy.',
      'El empleado realizó la solicitud en el sistema interno y se completó la verificación de identidad antes de modificar sus datos bancarios.',
      ['La solicitud llega desde una dirección nueva no verificada', 'Pide omitir la verificación de identidad']],

    ['Envíos y mensajería', 'MENSAJE',
      'Su paquete de oficina está retenido. Pague una tasa mediante este enlace de un dominio desconocido e ingrese el PIN de su tarjeta.',
      'Con el número de seguimiento de una compra registrada consultaste directamente el sitio oficial de la mensajería, sin ingresar el PIN de una tarjeta.',
      ['Utiliza un dominio desconocido para cobrar', 'Solicita el PIN de una tarjeta']],

    ['Encuestas internas', 'SITIO_WEB',
      'Una encuesta anónima externa exige la contraseña corporativa y una copia de la base de datos de clientes para permitirte responder.',
      'La encuesta anunciada por comunicaciones internas recoge opiniones sin credenciales ni archivos de clientes y explica su finalidad.',
      ['Solicita la contraseña para una encuesta', 'Pide una base de datos de clientes sin relación con la encuesta']],

    ['Acceso remoto a equipos', 'MENSAJE',
      'Un supuesto auditor sin cita pide instalar una herramienta remota y darle control total. Insiste en que no informes a seguridad informática.',
      'Una revisión autorizada y agendada se coordina con el departamento de tecnología mediante un ticket verificado y el procedimiento establecido.',
      ['Pide control remoto sin autorización previa', 'Solicita ocultar la conexión a seguridad informática']],
  ],

  ADULTO_MAYOR: [
    ['Mensajes y seguridad bancaria', 'MENSAJE',
      'Su cuenta será bloqueada en cinco minutos. Responda con su PIN bancario y no contacte al banco.',
      'Abriste por tu cuenta la aplicación oficial que usas habitualmente y consultaste tu estado de cuenta. Nadie te solicita enviar PIN ni códigos por mensaje.',
      ['Solicita el PIN bancario por mensaje', 'Amenaza con un bloqueo inmediato']],

    ['Familiares con número nuevo', 'MENSAJE',
      'Soy tu nieta desde otro número. Transfiere dinero ahora y no me llames ni consultes a mi mamá.',
      'Tu familiar llamó desde su contacto habitual y confirmaron una visita con información conocida. No solicitó dinero ni claves.',
      ['Usa un número nuevo sin verificar su identidad', 'Impide confirmar la solicitud con la familia']],

    ['Premios inesperados', 'MENSAJE',
      'Ganó una lotería en la que no participó. Pague primero una comisión para liberar el premio y envíe su tarjeta bancaria.',
      'En una actividad presencial a la que te inscribiste, el organizador identificado entrega un reconocimiento sin cobrar por reclamarlo ni pedir datos bancarios.',
      ['Anuncia un premio de una lotería no jugada', 'Exige pagar antes de recibir el supuesto premio']],

    ['Pensiones y jubilación', 'EMAIL',
      'Para no perder su pensión, entregue su contraseña bancaria en este correo y deposite una cuota a una cuenta personal hoy mismo.',
      'Consultaste tu trámite por el canal oficial conocido de la entidad y recibiste una lista de documentos, sin pedir contraseñas bancarias ni pagos a particulares.',
      ['Pide la contraseña bancaria para un trámite', 'Exige un depósito a una cuenta personal']],

    ['Falso soporte de computadora', 'SITIO_WEB',
      'Una ventana anuncia que su computadora está infectada. Llame al número del anuncio y dé acceso remoto; no cierre la ventana ni consulte a alguien de confianza.',
      'Solicitaste una revisión a un técnico que conoces. Acordaron el servicio y su costo por el contacto habitual, sin amenazas desde una ventana inesperada.',
      ['El aviso de infección aparece sin haber solicitado ayuda', 'Pide acceso remoto y evita consultar a otra persona']],

    ['Compras en redes sociales', 'RED_SOCIAL',
      'Un vendedor ofrece un electrodoméstico muy barato, exige depósito inmediato y rechaza mostrar el producto o proporcionar un comprobante.',
      'En un comercio conocido revisaste el producto, su garantía y el precio antes de pagar, y recibiste comprobante.',
      ['Exige depositar antes de verificar el producto', 'Se niega a proporcionar comprobante']],

    ['Paquetes no solicitados', 'MENSAJE',
      'Tiene un paquete que no esperaba. Para liberarlo, entre a este sitio desconocido e ingrese el PIN bancario y un código recibido por SMS.',
      'Esperabas una compra y consultaste su seguimiento en la aplicación oficial de la mensajería, sin entregar PIN ni códigos bancarios.',
      ['Notifica un envío que no esperaba', 'Solicita PIN y código bancario']],

    ['Donaciones y colectas', 'RED_SOCIAL',
      'Una colecta sin organización identificable exige donar ahora a una cuenta personal y se niega a explicar quién recibirá el dinero.',
      'En una organización que conoces verificaste el destino de la ayuda, sus datos de contacto y el mecanismo para recibir un comprobante.',
      ['No identifica una organización responsable', 'Oculta el destino de los fondos']],

    ['Amistades y romance en línea', 'MENSAJE',
      'Una persona que solo conoces por internet promete una relación, pero nunca acepta una videollamada y pide dinero urgente para viajar a verte.',
      'Una amistad de tu comunidad propone reunirse en una actividad pública conocida, sin pedir dinero ni información financiera.',
      ['Evita verificar su identidad por videollamada', 'Solicita dinero basándose en una relación solo virtual']],

    ['Medicamentos y ofertas', 'SITIO_WEB',
      'Una página sin responsable identificado promete curar cualquier enfermedad con un producto secreto y exige pagar antes de consultar a un profesional.',
      'En una farmacia identificada consultas información del producto y puedes verificarla con tu profesional de salud antes de comprar, sin presión para decidir.',
      ['Promete curar cualquier enfermedad con un producto secreto', 'Presiona para pagar antes de consultar']],

    ['Códigos de WhatsApp', 'MENSAJE',
      'Me llegó por error un código a tu teléfono. Envíamelo para que pueda recuperar mi cuenta; no leas el aviso que dice que no debes compartirlo.',
      'Dentro de la aplicación oficial revisaste las opciones de seguridad. Nadie te solicita compartir códigos de verificación por chat.',
      ['Solicita un código recibido en tu teléfono', 'Pide ignorar la advertencia de no compartirlo']],

    ['Servicios básicos', 'MENSAJE',
      'Cortaremos su electricidad en veinte minutos. Pague a esta cuenta personal; no llame a la empresa para comprobar la deuda.',
      'Consultaste directamente tu recibo en el canal oficial de la empresa y verificaste el importe y los medios autorizados de pago.',
      ['Amenaza con un corte inmediato', 'Pide pagar a un particular y evitar verificar']],

    ['Inversiones milagrosas', 'RED_SOCIAL',
      'Duplique sus ahorros en una semana sin ningún riesgo. Transfiera hoy; no revelamos quién administra el dinero ni cómo se genera la ganancia.',
      'En una entidad identificada recibes información escrita sobre condiciones y riesgos, y tiempo para revisarla sin presión ni promesas de ganancias garantizadas.',
      ['Promete duplicar el dinero sin riesgo', 'Oculta quién administra los fondos']],

    ['Visitas de falsos técnicos', 'MENSAJE',
      'Un desconocido anuncia que llegará a revisar su medidor sin cita. Exige efectivo y dice que no debe comprobar su identidad con la empresa.',
      'Solicitaste una visita y confirmaste la cita llamando al número oficial que ya conocías. La empresa explicó cómo verificar la identidad del técnico.',
      ['Anuncia una visita no solicitada y exige efectivo', 'Impide verificar la identidad con la empresa']],

    ['Protección de documentos personales', 'MENSAJE',
      'Para recibir un reembolso que no solicitó, envíe fotos de su documento, tarjeta y PIN a este número desconocido antes de una hora.',
      'Iniciaste un trámite presencial en una entidad conocida. Te explicaron qué documento se necesita y para qué, sin pedir fotos de tarjetas ni PIN.',
      ['Ofrece un reembolso no solicitado', 'Pide documentos y PIN por un contacto desconocido']],
  ],
};

export function construirEscenarios(entrada, indice) {
  const [nombre, tipo, fraude, seguro, alertas] = entrada;

  const casos = [
    { mensaje: fraude, esFraude: true },
    { mensaje: seguro, esFraude: false },
  ];

  if (indice % 2) casos.reverse();

  return casos.map((caso, posicion) => ({
    title: `${nombre}: caso ${posicion + 1}`,
    description: `Analiza la situación y las señales relacionadas con ${nombre.toLowerCase()}.`,
    type: tipo,
    order: posicion + 1,
    content: {
      message: caso.mensaje,
    },
    isFraud: caso.esFraude,
    signals: [
      ...alertas.map((text) => ({
        text,
        isCorrect: caso.esFraude,
      })),
      {
        text: 'El mensaje está escrito en español',
        isCorrect: false,
      },
    ],
    explanation: caso.esFraude
      ? `Las señales que justifican la respuesta son: ${alertas.join('; ')}.`
      : 'El contexto describe un canal verificado y no presenta ninguna de las señales de alerta ofrecidas. Esta conclusión corresponde a este caso concreto.',
    recommendation: 'Verifica cualquier solicitud sensible mediante un canal oficial que ya conozcas. No entregues contraseñas, PIN ni códigos de acceso a otras personas.',
    points: 10,
    active: true,
  }));
}