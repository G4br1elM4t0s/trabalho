import { StudentAddAccountModel } from '../../domain/studentUsecases/student-add-account';
import { StudentAccountModel } from '../../domain/models/studentAccount';


export interface AddStudentAccountRepository {
  add(studentAccountData: StudentAddAccountModel): Promise<StudentAccountModel>
}