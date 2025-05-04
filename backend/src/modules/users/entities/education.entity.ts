export enum DegreeType {
  BACHELOR = 'Licenciatura',
  MASTER = 'Maestría',
  DOCTORATE = 'Doctorado',
  ASSOCIATE = 'Técnico Superior',
  DIPLOMA = 'Diploma',
  CERTIFICATION = 'Certificación',
  OTHER = 'Otro',
}

export class Education {
  id: string; // Unique identifier for the education record

  //@Column()
  institution: string; // Ej: "Universidad de Buenos Aires"

  //   @Column({
  //     type: 'enum',
  //     enum: DegreeType,
  //     default: DegreeType.BACHELOR,
  //   })
  degree_type: DegreeType;

  //@Column()
  field_of_study: string; // Eg: "Computer Science"

  //@Column({ type: 'date' })
  start_date: Date;

  //@Column({ type: 'date', nullable: true })
  end_date: Date | null; // Null if still studying

  //@Column({ type: 'text', nullable: true })
  description?: string; // Additional details about the education (optional)

  //   // Relación Many-to-One con Candidate
  //   @ManyToOne(() => Candidate, (candidate) => candidate.education)
  //   candidate: Candidate;
}
