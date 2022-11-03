import { HttpRequest, HttpResponse } from "./http";

export interface StudentController{
  handle(httpRequest: HttpRequest): Promise<HttpResponse>;
}