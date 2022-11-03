import { describe, test, expect,vitest } from 'vitest';
import { Encrypter,StudentAccountModel,StudentAddAccount,AddStudentAccountRepository } from './db-add-student-account-protocools';
import {DbAddStudentAccount} from './db-add-account'
import isEmail from 'validator/lib/isEmail';




const makeEncrypter = ():Encrypter =>{
  class EncrypterStub implements Encrypter{
    async encrypt(value:string): Promise<string>{
      return new Promise(resolve=> resolve('hashed_password'));
    }
  }
  return new EncrypterStub();
}


const makeAddStudentAccountRepository = ():AddStudentAccountRepository =>{
  class AddStudentRepositoryStub implements AddStudentAccountRepository{
    async add(studentAccountData: StudentAddAccountModel): Promise<StudentAccountModel> {
      const fakeAccount ={
        id:'valid_id',
        name:'valid_name',
        email:'valid_email',
        password:'hashed_password'
      }
      return new Promise(resolve=> resolve(fakeAccount));
    }
  }
  return new AddStudentRepositoryStub();
}


interface SutTypes{
  sut: DbAddStudentAccount;
  encrypterStub: Encrypter;
  addStudentAccountRepositoryStub:AddStudentAccountRepository;
}

// dia 24 13hrs av jorge amado farmacia imbui pague menos proucurar por rebeca

const makeSut = (): SutTypes =>{
  const addStudentAccountRepositoryStub = makeAddStudentAccountRepository();
  const encrypterStub = makeEncrypter(); 
  const sut = new DbAddStudentAccount(encrypterStub,addStudentAccountRepositoryStub);

  return{
    sut,
    encrypterStub,
    addStudentAccountRepositoryStub
  }
}


describe('DbAddAccount UseCase',()=>{
  test('Should call Encrypter with correct password',async ()=>{
    const {sut,encrypterStub} = makeSut();
    const encryptSpy = vitest.spyOn(encrypterStub,'encrypt')
    const studentAccountData = {
      name:'valid_name',
      email:'valid_email',
      password:'valid_password'
    }
    sut.add(studentAccountData)
    await expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  });

  test('Should throw if Encrypter throws',async ()=>{
    const {sut,encrypterStub} = makeSut();
    vitest.spyOn(encrypterStub,'encrypt').mockReturnValueOnce(new Promise((resolve,reject)=> reject(new Error)));
    const studentAccountData = {
      name:'valid_name',
      email:'valid_email',
      password:'valid_password'
    }
    const promise = sut.add(studentAccountData)
    await expect(promise).rejects.toThrow()
  });

  test('Should call AddStudentAccountRepository with correct values',async ()=>{
    const {sut,addStudentAccountRepositoryStub} = makeSut();
    const addSpy = vitest.spyOn(addStudentAccountRepositoryStub,'add');
    const studentAccountData = {
      name:'valid_name',
      email:'valid_email',
      password:'valid_password'
    }
    sut.add(studentAccountData);
    
    await expect(addSpy).toHaveBeenCalledWith({
      name:'valid_name',
      email:'valid_email',
      password:'hashed_password'
    });
  });
});