import {StudentAccountModel}  from '../models/studentAccount'

export interface StudentAddAccountModel{
  name: string;
  email:string;
  password:string;
}



export interface StudentAddAccount{
  add(studentAccount: StudentAddAccountModel): Promise<StudentAccountModel>;
}