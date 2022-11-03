// import {MongoClient} from 'mongodb'

// import { test, expect, beforeAll, afterAll,it } from 'vitest';
// import { describe } from 'vitest';

// import { setup, teardown } from "vitest-mongodb";

// beforeAll(async () => {
//   await setup();
// });

// afterAll(async () => {
//   await teardown();
// });
  
//   it("connects to mongodb", () => {
    
//     expect(async () => {
//       let __MONGO_URI__:string;
//       const client = new MongoClient(globalThis.__MONGO_URI__);
//       try {
//         const db = client.db("test");
//         await db.command({ ping: 1 });
//       } finally {
//         await client.close();
//       }
//     }).not.toThrow();
//   });
// describe('Account mongo Repository',()=>{
//   test('Should return an account on sucess',async ()=>{
//     //const sut = new AccountMongoRepository()
//     const studentAccount = await sut.add({
//       name:'any_name',
//       email:'any_email@email.com',
//       password:'any_password'
//     });
//     expect(studentAccount).toBeTruthy()
//     expect(studentAccount.id).toBeTruthy()
//     expect(studentAccount.name).toBe('any_name')
//     expect(studentAccount.email).toBe('any_email')
//     expect(studentAccount.password).toBe('any_password')
    
//   })


// })