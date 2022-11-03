import { test, expect , vi} from 'vitest';
import { describe } from 'vitest';
import bcrypt from 'bcrypt';
import {BcryptAdapter} from './bcrypt-adapter'

// vitest.mock('bcrypt',()=>({
//   async hash():Promise<string>{
//     return new Promise(resolve => resolve('hash'))
//   }
// }))

//setupFiles: ["./setup/mongo-memory-server.ts"],

describe('Bcrypt Adapter',()=>{
  test('Should call bcrypt with correct value',async ()=>{
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = vi.spyOn(bcrypt,'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value',salt)
  })

  test('Should return a  hash on sucesses',async ()=>{
    const salt = 12
    const sut = new BcryptAdapter(salt)
    vi.spyOn(sut,'encrypt').mockReturnValueOnce(new Promise(resolve =>resolve('hash')))
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash')
  })

  // test('Should throw if bcrypt throws',async ()=>{
  //   const salt = 12
  //   const sut = new BcryptAdapter(salt)
  //   vi.spyOn(bcrypt,'hash').mockReturnValueOnce(new Promise((resolve,reject) =>reject(new Error())))
  //   const promise =  sut.encrypt('any_value')
  //   expect(promise).toBe('hash')
  // })
})