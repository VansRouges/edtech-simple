export interface Assignment {
  title: string;
  subject: string;
  className: string;
  teacher: string;
  dueDate: string;
  creatorEmail: string;
}

export interface AssignmentsTable extends Assignment {
  $id: string;
  }

export interface Student {
  firstName: string;
  lastName: string;
  gender: string;
  className: string;
  gpa: number;
  creatorEmail: string;
}

export interface StudentsTable extends Student {
  $id: string;
}