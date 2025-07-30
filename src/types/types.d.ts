export {};
declare global {
  enum Status {
    AGENDADA = "AGENDADA",
    CANCELADA = "CANCELADA",
    CONCLUIDA = "CONCLUIDA",
  }
  interface Specialty {
    id: string;
    name: string;
  }
  interface Patient {
    id: string;
    name: string;
    cpf: string;
    dateOfBirth: string;
    phone: string;
    appointment: Appointment[];
  }
  interface Appointment {
    id: string;
    dateTime: Date;
    status: Status;
    patientId: string;
    doctorId: string;
    doctor?: Doctor;
    patient?: Patient;
  }
  interface Doctor {
    id: string;
    name: string;
    crm: string;
    specialtiesId: string;
    specialties: Specialty;
  }
}
