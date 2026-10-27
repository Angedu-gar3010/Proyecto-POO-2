import 'dotenv/config';
import mongoose from 'mongoose';

import Usuario from '../src/user/user.model.js';
import Nivel from '../src/level/level.model.js';
import Escenario from '../src/scenario/scenario.model.js';
import Progreso from '../src/progreso/progreso.model.js';
import { ROLES, ROLES_JUGADOR } from '../src/user/user.constants.js';

const propuestas = [
  {
    rol: ROLES.ESTUDIANTE,
    nombre: 'Becas y mensajes estudiantiles',
    remitente: 'becas@premios-estudiantiles.example',
    mensaje: 'Ganaste una beca sin haberla solicitado. Tienes 10 minutos para pagar una cuota de activación y recibirla.',
    legitimo: 'En el portal oficial de tu centro educativo, al que entraste escribiendo su dirección, aparece: el calendario de exámenes está disponible. No se solicita ningún pago ni contraseña.',
    tercero: 'Soy del grupo de tu clase. Dime el código de verificación que acaba de llegar a tu teléfono para agregarte al grupo de becas.',
  },
  {
    rol: ROLES.PERSONAL_ADMINISTRATIVO,
    nombre: 'Correos y pagos administrativos',
    remitente: 'direccion@pagos-urgentes.example',
    mensaje: 'Soy el director. Transfiere hoy el pago de un proveedor a esta nueva cuenta. No llames para verificarlo; es confidencial y urgente.',
    legitimo: 'Dentro del sistema interno habitual, al que accediste por tu marcador verificado, ves: la reunión de coordinación será mañana a las 9:00. No se solicita transferir dinero ni compartir credenciales.',
    tercero: 'Soy de soporte. Envíame tu contraseña y el código de acceso para corregir el correo. No abras un ticket ni consultes a tu supervisor.',
  },
  {
    rol: ROLES.ADULTO_MAYOR,
    nombre: 'Mensajes y seguridad bancaria',
    remitente: 'alertas@verificacion-bancaria.example',
    mensaje: 'Su cuenta será bloqueada en 5 minutos. Responda con su PIN bancario para evitar el bloqueo. No contacte al banco.',
    legitimo: 'Abriste por tu cuenta la aplicación oficial del banco que utilizas habitualmente. Allí ves: su estado de cuenta está disponible. Nadie le pide su PIN ni códigos por mensaje.',
    tercero: 'Hola, soy tu nieto y cambié de número. Tengo una emergencia: envía dinero ahora a esta cuenta. No me llames, no puedo contestar.',
  },
];

async function prepararDatos() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Falta MONGODB_URI');
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const antiguos = await Usuario.collection.find({
    role: { $nin: Object.values(ROLES) },
  }).toArray();

  const ambiguos = antiguos.filter(
    (usuario) => !ROLES_JUGADOR.includes(usuario.profile),
  );

  const predeterminado = process.env.ROL_LEGADO;

  if (
    ambiguos.length &&
    !ROLES_JUGADOR.includes(predeterminado)
  ) {
    throw new Error(
      `Hay ${ambiguos.length} cuentas sin perfil convertible. Asigna su rol manualmente o configura ROL_LEGADO con un rol de jugador antes de ejecutar nuevamente.`,
    );
  }

  for (const usuario of antiguos) {
    const rol = ROLES_JUGADOR.includes(usuario.profile)
      ? usuario.profile
      : predeterminado;

    await Usuario.collection.updateOne(
      { _id: usuario._id },
      {
        $set: {
          role: rol,
          tokenVersion: (usuario.tokenVersion || 0) + 1,
        },
        $unset: { profile: '' },
      },
    );
  }

  await Promise.all([
    Usuario.init(),
    Nivel.init(),
    Escenario.init(),
    Progreso.init(),
  ]);

  for (const propuesta of propuestas) {
    let nivel = await Nivel.findOne({
      name: propuesta.nombre,
      roles: propuesta.rol,
    });

    if (!nivel) {
      const ultimo = await Nivel.findOne().sort({ number: -1 });

      nivel = await Nivel.create({
        number: (ultimo?.number || 0) + 1,
        name: propuesta.nombre,
        description: `Practica la identificación de estafas: ${propuesta.nombre.toLowerCase()}.`,
        roles: [propuesta.rol],
        requiredScore: 0,
      });
    }

    const ejemplos = [
      {
        titulo: 'Una solicitud urgente',
        mensaje: propuesta.mensaje,
        fraude: true,
        senales: [
          ['Presiona para actuar sin verificar', true],
          ['Solicita dinero o información sensible', true],
          ['Incluye un saludo', false],
        ],
        explicacion: 'La presión y la solicitud de dinero o información sensible son señales de fraude en este contexto.',
      },
      {
        titulo: 'Una consulta por el canal oficial',
        mensaje: propuesta.legitimo,
        fraude: false,
        senales: [
          ['Solicita una contraseña por mensaje', false],
          ['Exige una transferencia urgente', false],
          ['Amenaza con un bloqueo inmediato', false],
        ],
        explicacion: 'En este escenario accediste por un canal oficial verificado y no aparece ninguna de las señales de alerta propuestas.',
      },
      {
        titulo: 'Una identidad que debes verificar',
        mensaje: propuesta.tercero,
        fraude: true,
        senales: [
          ['La identidad del remitente no está verificada', true],
          ['Pide dinero o credenciales fuera del procedimiento habitual', true],
          ['El mensaje está escrito en español', false],
        ],
        explicacion: 'Afirmar ser alguien conocido no prueba su identidad. La petición de dinero o credenciales por esta vía requiere detenerse y verificar.',
      },
    ];

    for (const [indice, ejemplo] of ejemplos.entries()) {
      if (await Escenario.exists({
        level: nivel.id,
        order: indice + 1,
      })) {
        continue;
      }

      await Escenario.create({
        title: ejemplo.titulo,
        description: `Analiza este caso de ${propuesta.nombre.toLowerCase()}.`,
        type: 'MENSAJE',
        level: nivel.id,
        order: indice + 1,
        content: {
          sender: indice === 1
            ? 'Canal oficial verificado'
            : propuesta.remitente,
          message: ejemplo.mensaje,
        },
        isFraud: ejemplo.fraude,
        signals: ejemplo.senales.map(([text, isCorrect]) => ({
          text,
          isCorrect,
        })),
        explanation: ejemplo.explicacion,
        recommendation: 'Verifica mediante un canal oficial que ya conozcas. Nunca compartas contraseñas, PIN ni códigos de acceso.',
        points: 10,
      });
    }
  }

  console.log(
    'Roles migrados y tres niveles preparados. El progreso existente se conserva.',
  );
}

prepararDatos()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());