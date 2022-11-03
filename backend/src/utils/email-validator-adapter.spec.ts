import { describe,expect,test ,vitest} from "vitest";
import {EmailValidatorAdapter} from "./email-validator-adapter";
import validator from 'validator';

console.log('Os teste abaixo ferem a diretriz de testes automatizados!');

// vitest.mock('validator',()=>({
//   isEmail ():boolean{
//     return true;
//   }
// }));

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
}

describe('EmailValidator Adapter',()=>{
  test('Should return false if validator returns false',()=>{
    const sut = makeSut();
    vitest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValid = sut.isValid('invalid_email@email.com');
    expect(isValid).toBe(false);
  });

  

  test('Should return true if validator returns true',()=>{
    const sut = makeSut();
    const isValid = sut.isValid('valid_email@email.com');
    expect(isValid).toBe(true);
  });

  test('Should call validator withcorrect email',()=>{
    const sut = makeSut();
    const isEmailSpy = vitest.spyOn(validator,'isEmail');
    sut.isValid('any_email@email.com');
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@email.com')
  });


});