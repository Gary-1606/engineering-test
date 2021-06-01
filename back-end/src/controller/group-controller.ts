import { NextFunction, Request, Response } from "express"
import { ServerResponse } from "node:http"
import { getRepository } from "typeorm"
import { Group } from "../entity/group.entity"
import { CreateGroupInput, UpdateGroupInput } from "../interface/group.interface"
import { CreateGroupStudentInput } from "../interface/group-student.interface"
import { GroupStudent } from "../entity/group-student.entity"
import { map } from "lodash"
import { Student } from "../entity/student.entity"

export class GroupController {
  private groupRepository = getRepository(Group)
  private groupStudentRepository = getRepository(GroupStudent)
  private studentRepository = getRepository(Student)

  async allGroups(request: Request, response: Response, next: NextFunction) {
    // Task 1:
    // Return the list of all groups
    return this.groupRepository.find()
  }

  async createGroup(request: Request, response: Response, next: NextFunction) {
    // Task 1:

    // Add a Group
    const { body: params } = request
    console.log(params)
    const createGroupInput: CreateGroupInput = {
      name: params.name,
      number_of_weeks: params.number_of_weeks,
      roll_states: params.roll_states,
      incidents: params.incidents,
      ltmt: params.ltmt,
      run_at: params.run_at,
      student_count: params.student_count,
    }
    const group = new Group()
    group.prepareToCreate(createGroupInput)
    return this.groupRepository.save(group)
  }

  async updateGroup(request: Request, response: Response, next: NextFunction) {
    // Task 1:
    // Update a Group
    const { body: params } = request
    this.groupRepository.findOne(params.id).then((group) => {
      const updateGroupInput: UpdateGroupInput = {
        id: params.id,
        name: params.name,
        number_of_weeks: params.number_of_weeks,
        roll_states: params.roll_states,
        incidents: params.incidents,
        ltmt: params.ltmt,
        run_at: params.run_at,
        student_count: params.student_count,
      }
      group.prepareToUpdate(updateGroupInput)
      return this.groupRepository.save(group)
    })
  }

  async removeGroup(request: Request, response: Response, next: NextFunction) {
    // Task 1:
    // Delete a Group

    let groupToRemove = await this.groupRepository.findOne(request.params.id)
    return this.groupRepository.remove(groupToRemove)
  }

  async addGroupStudents(request: Request, response: ServerResponse, next: NextFunction) {
    // Add student to a group
    const { body: params } = request

    //check if the group and student exist
    const groupStudents: GroupStudent[] = map(params, (param) => {
      const createGroupStudent: CreateGroupStudentInput = {
        student_id: params.student_id,
        group_id: params.group_id,
        incident_count: params.incident_count,
      }
      const groupStudent = new GroupStudent()
      groupStudent.prepareToCreate(createGroupStudent)
      return groupStudent
    })
    return this.groupStudentRepository.save(groupStudents)
  }

  async addGroupStudent(request: Request, response: ServerResponse, next: NextFunction) {
    // Add student to a group
    const { body: params } = request

    //check if the group and student exist
    const createGroupStudent: CreateGroupStudentInput = {
      student_id: params.student_id,
      group_id: params.group_id,
      incident_count: params.incident_count,
    }
    const groupStudent = new GroupStudent()
    groupStudent.prepareToCreate(createGroupStudent)
    return this.groupStudentRepository.save(groupStudent)
  }

  async getGroupStudents(request: Request, response: Response, next: NextFunction) {
    // Task 1:
    // Return the list of Students that are in a Group

    const { body: params } = request

    return await this.groupStudentRepository.find({ where: { group_id: params.group_id } }).then(async (groupStudents) => {
      const students = await groupStudents.map(async (groupStudent) => {
        return await this.studentRepository.findOne(groupStudent.student_id).then((student) => {
          return { ...student, full_name: student.first_name + " " + student.last_name }
        })
      })
      return Promise.all(students).then((studentList) => {
        return studentList
      })
    })
  }

  async runGroupFilters(request: Request, response: Response, next: NextFunction) {
    // Task 2:
    // 1. Clear out the groups (delete all the students from the groups)
    // 2. For each group, query the student rolls to see which students match the filter for the group
    // 3. Add the list of students that match the filter to the group
  }
}
