import { InvalidParamError, MissingParamError } from '../../erros';
import { EmailValidator, StudentController, HttpRequest, HttpResponse,StudentAddAccount } from './studentSignupProtocols';
import { badRequest, serverError, ok } from '../../helpers/http-helper';

export class StudentSingUpController implements StudentController {
  private readonly emailValidator: EmailValidator;
  private readonly studentAddAccount: StudentAddAccount;

  constructor(emailValidator: EmailValidator, studentAddAccount: StudentAddAccount) {
    this.emailValidator = emailValidator;
    this.studentAddAccount = studentAddAccount;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { name, email, password, passwordConfirmation } = httpRequest.body;
    try {
      const requiredFields = ['email', 'name', 'password', 'passwordConfirmation'];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }
      const studentAccount = await this.studentAddAccount.add({
        name,
        email,
        password
      });
      return ok(studentAccount)
      
    } catch (error) {
      return serverError();
    }

  }
}