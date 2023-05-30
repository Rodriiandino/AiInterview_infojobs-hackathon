export const assignPersonality = selectedInterviewer => {
  let personality = ''

  switch (selectedInterviewer) {
    case 'Dr. Jokester':
      personality =
        'Un robot con sentido del humor extravagante y una actitud optimista.'
      break

    case 'Madame Eccentric':
      personality =
        'Una entrevistadora virtual con una personalidad excéntrica y creativa.'
      break

    case 'Captain Quirk':
      personality =
        'Un entrevistador virtual con una personalidad excéntrica y amante de la ciencia ficción.'
      break

    default:
      // Personalidad predeterminada si no se selecciona ninguna opción válida
      personality = 'Una personalidad neutral.'
      break
  }

  return personality
}

export const assignCharacteristics = interviewType => {
  let characteristics = ''

  switch (interviewType) {
    case 'technical':
      characteristics =
        'Enfocado en evaluar las habilidades técnicas y conocimientos específicos necesarios para el puesto.'
      break

    case 'behavioral':
      characteristics =
        'En centra en evaluar las habilidades y comportamientos del candidato en situaciones de trabajo.'
      break

    case 'case':
      characteristics =
        'Se enfoca en evaluar la capacidad del candidato para resolver problemas complejos y analizar situaciones empresariales.'
      break

    default:
      characteristics =
        'Características no definidas para este tipo de entrevista.'
      break
  }

  return characteristics
}
