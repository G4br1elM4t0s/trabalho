import { expect, test, vitest } from 'vitest';
import { StudentSingUpController } from './studentSingUp';
import { MissingParamError, InvalidParamError , ServerError} from '../../erros';
import { EmailValidator,StudentAddAccount ,StudentAddAccountModel,StudentAccountModel } from './studentSignupProtocols';


//Factory method abaixo
const makeStudentAddAccount = (): StudentAddAccount =>{
  class StudentAddAccountStub implements StudentAddAccountStub { // injetando a class para validar o email ( ou seja não é uma class de produção e sim estou mokando a class para validar o email )
    async add(studentAccount: StudentAddAccountModel): Promise<StudentAccountModel> {
        const fakeAccount ={
          id: 'valid_id',
          name:'valid_name',
          email: 'valid_email@email.com',
          password: 'valid_password',
        }
        return new Promise(resolve => resolve(fakeAccount));
    }
  }
  return new StudentAddAccountStub();
};

const makeEmailValidator = (): EmailValidator =>{
  class EmailValidatorStub implements EmailValidator { // injetando a class para validar o email ( ou seja não é uma class de produção e sim estou mokando a class para validar o email )
    isValid(email: string): boolean {
      return true; //duble de teste , sempre iniciar o mok com valor positivo para que não influencie em outros testes
    }
  }
  return new EmailValidatorStub();
};

interface SutTypes{
  sut: StudentSingUpController;
  emailValidatorStub: EmailValidator;
  studentAddAccountStub: StudentAddAccount;
}

const makeSut = (): SutTypes => {
  const studentAddAccountStub = makeStudentAddAccount();
  const emailValidatorStub = makeEmailValidator();
  const sut = new StudentSingUpController(emailValidatorStub,studentAddAccountStub);
  return {
    sut,
    emailValidatorStub,
    studentAddAccountStub
  }

};

test('Should return 400 if student name is provided', async() => {
  const {sut} = makeSut();
  const httRequest = {
    body: {
      email: "john@doe.com",
      password: "123",
      passwordConfirmation: "123"
    }
  }
  const httpResponse = await await sut.handle(httRequest);
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingParamError('name'))
});

test('Should return 400 if student email is provided', async() => {
  const {sut} = makeSut();
  const httRequest = {
    body: {
      name: "JohnDoe",
      password: "123",
      passwordConfirmation: "123"
    }
  }
  const httpResponse = await sut.handle(httRequest);
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingParamError('email'))
});

test('Should return 400 if student password is provided', async() => {
  const {sut} = makeSut();
  const httRequest = {
    body: {
      name: "JohnDoe",
      email: "john@doe.com",
      passwordConfirmation: "123"
    }
  }
  const httpResponse = await sut.handle(httRequest);
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingParamError('password'))
});

test('Should return 400 if student passwordConfirmation is provided', async() => {
  const {sut} = makeSut();
  const httRequest = {
    body: {
      name: "JohnDoe",
      email: "john@doe.com",
      password: "123",
      
    }
  }
  const httpResponse = await sut.handle(httRequest);
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
});

test('Should return 400 if student passwordConfirmation fails',async () => {
  const {sut} = makeSut();
  const httRequest = {
    body: {
      name: "JohnDoe",
      email: "john@doe.com",
      password: "123",
      passwordConfirmation: "invalid_123"

    }
  }
  const httpResponse = await sut.handle(httRequest);
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
});

test('Should return 400 if an invalid student email is provided', async() => {
  const {sut, emailValidatorStub} = makeSut();
  vitest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

  const httRequest = {
    body: {
      name: "JohnDoe",
      email: "johnInvalid@doe.com",
      password: "123",
      passwordConfirmation: "123"
    }
  }
  const httpResponse = await sut.handle(httRequest);
  expect(httpResponse.statusCode).toBe(400);
  expect(httpResponse.body).toEqual(new InvalidParamError('email'));
});

test('Should call student emailValidator with correct email ', async() => {
  const {sut, emailValidatorStub} = makeSut();
  const isValidSpy =  vitest.spyOn(emailValidatorStub, 'isValid');


  const httRequest = {
    body: {
      name: "JohnDoe",
      email: "joh@doe.com",
      password: "123",
      passwordConfirmation: "123"
    }
  }
  await sut.handle(httRequest);
  expect(isValidSpy).toHaveBeenCalledWith('joh@doe.com');
  
});

test('Should return 500 if an student emailValidator throws', async() => {

  const {sut,emailValidatorStub} = makeSut();
  vitest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(()=>{ // mockei a impletação do meu meu metodo isValid para que ele possa me retornar um erro e não um boolean
    throw new Error();
  });
  const httpRequest = {
    body: {
      name: "JohnDoe",
      email: "johnInvalid@doe.com",
      password: "123",
      passwordConfirmation: "123"
    }
  }
  const httpResponse = await sut.handle(httpRequest);
  expect(httpResponse.statusCode).toBe(500);
  expect(httpResponse.body).toEqual(new ServerError());
});
test('Should return 500 if an student addAccount throws',async () => {
  const {sut,studentAddAccountStub} = makeSut();
  vitest.spyOn(studentAddAccountStub, 'add').mockImplementationOnce( async ()=>{ // mockei a impletação do meu meu metodo isValid para que ele possa me retornar um erro e não um boolean
    return new Promise((resolve,reject)=> reject(new Error()));
  });
  const httRequest = {
    body: {
      name: "JohnDoe",
      email: "johnInvalid@doe.com",
      password: "123",
      passwordConfirmation: "123"
    }
  }
  const httpResponse = await sut.handle(httRequest);
  expect(httpResponse.statusCode).toBe(500);
  expect(httpResponse.body).toEqual(new ServerError());
});

test('Should call AddAccount student with correct values  ', async() => {
  const {sut, studentAddAccountStub} = makeSut();
  const addSpy =  vitest.spyOn(studentAddAccountStub, 'add');
  const httRequest = {
    body: {
      name: "JohnDoe",
      email: "joh@doe.com",
      password: "123",
      passwordConfirmation: "123"
    }
  }
  sut.handle(httRequest);
  expect(addSpy).toHaveBeenCalledWith({
    name: "JohnDoe",
    email: "joh@doe.com",
    password: "123"
  });
  
});

test('Should return 200 if valid data is provided',async () => {
  const {sut} = makeSut();

  const httRequest = {
    body: {
      name: "JohnDoe",
      email: "johnInvalid@doe.com",
      password: "123",
      passwordConfirmation: "123"
    }
  }
  const httpResponse = await sut.handle(httRequest);
  expect(httpResponse.statusCode).toBe(200);
  expect(httpResponse.body).toEqual({
    id: 'valid_id',
    name: "valid_name",
    email: "valid_email@email.com",
    password: "valid_password",
  });
});