import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { CreateGroupInput } from "../interface/group.interface"

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  number_of_weeks: number

  @Column()
  roll_states: string

  @Column()
  incidents: number

  @Column()
  ltmt: string

  @Column({
    nullable: true,
  })
  run_at: Date

  @Column()
  student_count: number

  public prepareToCreate(input: CreateGroupInput) {
    this.name = input.name
    this.number_of_weeks = input.number_of_weeks
    // does not throw error on sending other than mentioned strings -> only not null error
    if (input.roll_states === "unmark" || input.roll_states === "present" || input.roll_states === "absent" || input.roll_states === "late") this.roll_states = input.roll_states
    this.incidents = input.incidents
    // does not throw error on sending other than mentioned strings -> only not null error
    if (input.ltmt === "<" || input.ltmt === ">") this.ltmt = input.ltmt
    this.student_count = input.student_count
  }
}
