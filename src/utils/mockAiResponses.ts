import { Topic, Difficulty } from '../types/chat';

// Basic responses based on topic and difficulty
const responses: Record<Topic, Record<Difficulty, string[]>> = {
  general: {
    beginner: [
      "¡Hola! ¿Cómo estás hoy?",
      "Muy bien. ¿Cómo te llamas?",
      "Encantado de conocerte. ¿De dónde eres?",
      "¿Cuánto tiempo llevas estudiando español?",
      "¿Qué te gusta hacer en tu tiempo libre?"
    ],
    intermediate: [
      "¡Qué bueno verte de nuevo! ¿Qué has hecho esta semana?",
      "Eso suena interesante. Cuéntame más sobre esa experiencia.",
      "¿Has viajado alguna vez a un país hispanohablante?",
      "¿Qué tipo de música te gusta escuchar?",
      "¿Cuáles son tus planes para el futuro?"
    ],
    advanced: [
      "Me parece fascinante lo que comentas. ¿Crees que esa perspectiva es común en tu cultura?",
      "Si tuvieras la oportunidad de vivir en cualquier país hispanohablante, ¿cuál elegirías y por qué?",
      "¿Cómo crees que el aprendizaje de idiomas ha influido en tu forma de ver el mundo?",
      "¿Qué opinas sobre las diferencias culturales entre los distintos países de habla hispana?",
      "Hablemos de algún tema de actualidad. ¿Qué noticias has seguido últimamente?"
    ]
  },
  travel: {
    beginner: [
      "¿A dónde te gustaría viajar?",
      "¿Necesitas ayuda para encontrar un hotel?",
      "El autobús sale a las diez de la mañana.",
      "¿Puedes recomendarme un buen restaurante cerca?",
      "¿Dónde está la estación de tren?"
    ],
    intermediate: [
      "¿Has tenido algún problema durante tu viaje hasta ahora?",
      "Te recomendaría visitar el museo que está en el centro de la ciudad.",
      "¿Prefieres alojarte en un hotel o en un apartamento turístico?",
      "¿Qué tipo de actividades te gustaría hacer durante tu estancia?",
      "¿Cómo planeas moverte por la ciudad? Hay varias opciones de transporte."
    ],
    advanced: [
      "Si comparas este destino con otros que has visitado, ¿qué aspectos destacarías como únicos?",
      "La cultura local tiene algunas costumbres particulares. Por ejemplo, las tiendas cierran durante varias horas al mediodía para la siesta.",
      "La arquitectura de esta zona refleja la influencia de diferentes culturas a lo largo de los siglos.",
      "¿Qué impresión te ha causado la gastronomía local? ¿Has probado algún plato típico que te haya sorprendido?",
      "Para experimentar verdaderamente la cultura local, te recomendaría participar en alguna de las festividades tradicionales."
    ]
  },
  restaurant: {
    beginner: [
      "¿Qué te gustaría comer hoy?",
      "¿Prefieres carne o pescado?",
      "¿Tienes alguna alergia alimentaria?",
      "La especialidad de la casa es la paella.",
      "¿Puedo traerte algo más?"
    ],
    intermediate: [
      "¿Te gustaría probar alguno de nuestros vinos locales con la comida?",
      "Este plato se prepara con ingredientes frescos de temporada.",
      "La receta de este plato ha pasado de generación en generación en la familia del chef.",
      "¿Prefieres una mesa en la terraza o dentro del restaurante?",
      "¿Puedo recomendarte nuestro menú de degustación para conocer mejor nuestra cocina?"
    ],
    advanced: [
      "Este plato representa la fusión de la cocina tradicional con técnicas modernas de la gastronomía molecular.",
      "El maridaje que sugiere nuestro sumiller realza los sabores complejos de este plato.",
      "La sostenibilidad es un valor fundamental en nuestro restaurante. Todos nuestros ingredientes son de proximidad y de temporada.",
      "¿Qué opinas sobre las nuevas tendencias en la gastronomía española contemporánea?",
      "Este postre reinventa un dulce tradicional, manteniendo su esencia pero con un enfoque innovador."
    ]
  },
  shopping: {
    beginner: [
      "¿Puedo ayudarte a encontrar algo en particular?",
      "¿Qué talla necesitas?",
      "Este producto cuesta veinte euros.",
      "El probador está al fondo a la derecha.",
      "¿Pagarás con tarjeta o en efectivo?"
    ],
    intermediate: [
      "Tenemos una oferta especial: si compras dos prendas, la tercera es a mitad de precio.",
      "Este modelo está disponible en varios colores. ¿Tienes alguna preferencia?",
      "Este material es muy duradero y fácil de lavar a máquina.",
      "Si no estás satisfecho con tu compra, puedes devolverla en un plazo de 30 días.",
      "¿Prefieres un estilo más clásico o algo más actual?"
    ],
    advanced: [
      "Esta prenda está elaborada con técnicas artesanales tradicionales que se remontan al siglo XVIII.",
      "Nuestra política de comercio justo garantiza condiciones laborales dignas para todos los trabajadores involucrados en la producción.",
      "Este diseñador se ha inspirado en elementos de la arquitectura modernista para crear esta colección exclusiva.",
      "¿Qué opinas sobre la tendencia actual hacia la moda sostenible y ética?",
      "El tejido utilizado en esta prenda es innovador porque combina fibras naturales con tecnología avanzada para mayor comodidad."
    ]
  },
  emergency: {
    beginner: [
      "¿Cuál es la emergencia?",
      "¿Necesitas un médico?",
      "La farmacia más cercana está en la esquina.",
      "Llame al 112 para emergencias.",
      "¿Eres alérgico a algún medicamento?"
    ],
    intermediate: [
      "Describa los síntomas que está experimentando, por favor.",
      "¿Desde cuándo ha estado sintiendo este dolor?",
      "¿Tiene alguna condición médica preexistente que debamos conocer?",
      "El hospital más cercano está a unos diez minutos en coche.",
      "¿Hay alguien a quien debamos contactar para informarle de su situación?"
    ],
    advanced: [
      "Basándome en los síntomas que describe, podría tratarse de una reacción alérgica. ¿Ha estado expuesto a algún alérgeno conocido recientemente?",
      "Es importante que mantengamos monitorizados sus signos vitales hasta que lleguen los servicios de emergencia.",
      "La asistencia sanitaria en este país funciona de manera diferente al suyo. Primero necesitaremos verificar su seguro de viaje.",
      "En situaciones como esta, es fundamental mantener la calma para poder comunicar claramente toda la información necesaria al personal médico.",
      "¿Podría detallar su historial médico? Cualquier información sobre condiciones crónicas, operaciones previas o medicación actual sería de gran ayuda."
    ]
  }
};

// Function to get a mock response based on user input, topic, and difficulty
export const getMockResponse = (
  userMessage: string, 
  topic: Topic, 
  difficulty: Difficulty
): string => {
  // Simple keyword matching for more relevant responses
  const lowerMessage = userMessage.toLowerCase();
  
  // Check for questions and common phrases
  if (lowerMessage.includes('¿cómo estás')) {
    return "Estoy muy bien, gracias por preguntar. ¿Y tú cómo estás?";
  }
  
  if (lowerMessage.includes('me llamo')) {
    const name = lowerMessage.split('me llamo')[1].trim().split(' ')[0];
    return `¡Encantado de conocerte, ${name}! ¿De dónde eres?`;
  }
  
  if (lowerMessage.includes('no entiendo')) {
    if (difficulty === 'beginner') {
      return "No hay problema. Vamos a intentarlo de nuevo más despacio. ¿Qué parte no entendiste?";
    } else {
      return "Déjame explicártelo de otra manera para que sea más claro.";
    }
  }
  
  if (lowerMessage.includes('gracias') || lowerMessage.includes('thank')) {
    return "De nada. Estoy aquí para ayudarte a practicar tu español.";
  }
  
  // Get random response based on topic and difficulty if no specific match
  const topicResponses = responses[topic][difficulty];
  return topicResponses[Math.floor(Math.random() * topicResponses.length)];
};