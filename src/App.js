// CORRECCIÓN EN LA FUNCIÓN traffic
const documentRequirements = {
  maternity: [
    'Licencia o incapacidad de maternidad',
    'Epicrisis o resumen clínico',
    'Cédula de la madre',
    'Registro civil',
    'Certificado de nacido vivo',
  ],
  paternity: (motherWorks) => {
    const docs = [
      'Epicrisis o resumen clínico',
      'Cédula del padre',
      'Registro civil',
      'Certificado de nacido vivo',
    ];
    if (motherWorks) {
      docs.push('Licencia o incapacidad de maternidad');
    }
    return docs;
  },
  general: (days) => {
    return days <= 2
      ? ['Incapacidad médica']
      : ['Incapacidad médica', 'Epicrisis o resumen clínico'];
  },
  labor: (days) => {
    return days <= 2
      ? ['Incapacidad médica']
      : ['Incapacidad médica', 'Epicrisis o resumen clínico'];
  },
  traffic: (vehiculoFantasma) => {
    const baseDocs = ['Incapacidad médica', 'Epicrisis o resumen clínico', 'FURIPS']; // Corrección aquí: era baseDoc
    if (!vehiculoFantasma) {
      baseDocs.push('SOAT'); // Corrección aquí: era baseDoc
    }
    return baseDocs; // Corrección aquí: era baseDoc
  },
};