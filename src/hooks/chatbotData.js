export const CHATBOT_DICTIONARY = [
  // --- INICIO DE TUS OPCIONES ORIGINALES ---
  {
    keywords: ["hola", "buenas", "hey", "saludos"],
    type: "text",
    response: "¡Hola! Soy el asistente de HECO. Puedo contarte sobre nuestros servicios, cómo contactarnos o cómo trabajamos. ¿Qué te gustaría saber?",
  },
  {
    keywords: ["servicio", "servicios", "que hacen", "ofrecen", "software", "consultoria", "consultoría"],
    type: "text",
    response: "Ofrecemos desarrollo de software a medida (ERP, apps de escritorio, sistemas de gestión) y consultoría administrativa para pequeñas y medianas empresas.",
  },
  {
    keywords: ["precio", "precios", "costo", "cuanto cuesta", "cotizacion", "cotización", "presupuesto"],
    type: "text",
    response: "Cada proyecto es distinto, así que armamos una propuesta a medida. Contame brevemente qué necesitás y te contactamos con un presupuesto.",
  },
  {
    keywords: [
      "contacto", "contactar", "comunicar", "comunicarme", "hablar",
      "correo", "email", "telefono", "teléfono", "whatsapp", "saber mas", "saber más",
    ],
    type: "options",
    response: "Con gusto — elegí por dónde preferís que sigamos la conversación:",
    options: [
      {
        label: "WhatsApp",
        sublabel: "Respuesta rápida",
        href: "https://wa.me/59160831964", // reemplazar por el número real
        icon: "whatsapp",
      },
      {
        label: "Correo",
        sublabel: "contacto@heco.com",
        href: "mailto:hecoadmin@gmail.com", // reemplazar por el correo real
        icon: "mail",
      },
    ],
  },
  {
    keywords: ["tiempo", "plazo", "cuanto tarda", "duracion", "duración"],
    type: "text",
    response: "Depende del alcance: un módulo simple puede tomar 3–4 semanas, un ERP completo puede llevar varios meses. Te damos un cronograma claro antes de arrancar.",
  },
  {
    keywords: ["gracias", "genial", "perfecto", "excelente"],
    type: "text",
    response: "¡De nada! Si tenés otra pregunta, acá estoy.",
  },
  // --- FIN DE TUS OPCIONES ORIGINALES ---

  // --- INICIO DE NUEVAS OPCIONES AMPLIADAS ---
  {
    keywords: ["ubicacion", "ubicación", "donde estan", "dónde están", "oficina", "pais", "ciudad", "lugar"],
    type: "text",
    response: "Trabajamos principalmente de forma remota para adaptarnos a tus tiempos, pero estamos siempre disponibles para reuniones virtuales. Si necesitás algo presencial, ¡escribinos y lo coordinamos!",
  },
  {
    keywords: ["soporte", "mantenimiento", "postventa", "posventa", "error", "bug", "ayuda", "falla"],
    type: "text",
    response: "¡Por supuesto! Todos nuestros desarrollos incluyen un período de garantía. Además, ofrecemos planes de soporte y mantenimiento continuo para asegurar que tu sistema siempre funcione al 100%.",
  },
  {
    keywords: ["tecnologia", "tecnología", "tecnologias", "tecnologías", "stack", "framework", "lenguajes", "herramientas"],
    type: "text",
    response: "Utilizamos herramientas modernas, seguras y escalables, adaptando el stack tecnológico (lenguajes, bases de datos y frameworks) a lo que mejor le convenga a tu proyecto y modelo de negocio.",
  },
  {
    keywords: ["clientes", "portfolio", "portafolio", "ejemplos", "experiencia", "trabajos", "casos de exito"],
    type: "text",
    response: "Hemos colaborado con empresas de diversos rubros optimizando su gestión operativa y administrativa. Si te gustaría ver casos de éxito puntuales, contactanos y te enviamos material detallado.",
  },
  {
    keywords: ["metodologia", "metodología", "proceso", "reuniones", "como trabajan", "etapas", "pasos"],
    type: "text",
    response: "Trabajamos con un enfoque ágil: nos reunimos con vos para entender tu negocio, planificamos por etapas, y te mostramos avances funcionales regularmente para asegurar que vamos por el camino correcto.",
  },
  {
    keywords: ["asesoria", "asesoría", "administrativa", "negocios", "ordenar", "consultoria administrativa", "procesos"],
    type: "text",
    response: "Nuestra consultoría administrativa busca ordenar tus procesos internos, mejorar la toma de decisiones y preparar a tu equipo para ser más eficiente, ya sea implementando nuevo software o mejorando lo que ya tenés.",
  },
  {
    keywords: ["horario", "horarios", "atencion", "atención", "horas", "cuando atienden"],
    type: "text",
    response: "Nuestro horario de atención comercial es de lunes a viernes de 9:00 a 18:00 hrs. De todas formas, dejá tu consulta y te responderemos a la brevedad posible.",
  },
  {
    keywords: ["adios", "adiós", "chau", "chao", "hasta luego", "nos vemos", "bye"],
    type: "text",
    response: "¡Que tengas un excelente día! Quedamos a tu disposición en HECO para cuando nos necesites.",
  }
];

export const FALLBACK_RESPONSE = {
  type: "text",
  response: "No tengo una respuesta a tu consulta — pero podés escribirnos a hecoadmin@gmail.com y te atendemos lo mas pronto posible.",
};

export function getChatbotResponse(userText) {
  const normalized = userText
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const match = CHATBOT_DICTIONARY.find((entry) =>
    entry.keywords.some((kw) =>
      normalized.includes(kw.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
    )
  );

  return match || FALLBACK_RESPONSE;
}