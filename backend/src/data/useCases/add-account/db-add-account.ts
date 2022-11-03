import {StudentAddAccount,StudentAddAccountModel,StudentAccountModel,Encrypter,AddStudentAccountRepository} from './db-add-student-account-protocools'


export class DbAddStudentAccount implements StudentAddAccount{
  private readonly encrypter: Encrypter;
  private readonly addStudentAccountRepository: AddStudentAccountRepository;

  constructor(encrypter:Encrypter,addStudentAccountRepository:AddStudentAccountRepository){
    this.encrypter = encrypter;
    this.addStudentAccountRepository = addStudentAccountRepository
  }
  async add(studentAccountData: StudentAddAccountModel): Promise<StudentAccountModel>{
    const hashedPassword = await this.encrypter.encrypt(studentAccountData.password)
    const studentAccount = await this.addStudentAccountRepository.add(Object.assign({},studentAccountData,{password:hashedPassword}))
    return studentAccount;
  }
}
//40

