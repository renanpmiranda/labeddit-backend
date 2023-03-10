import { BadRequestError } from './../../src/errors/BadRequestError';
import { HashManagerMock } from './../mocks/HashManagerMock';
import { TokenManagerMock } from './../mocks/TokenManagerMock';
import { IdGeneratorMock } from './../mocks/IdGeneratorMock';
import { UserDatabaseMock } from './../mocks/UserDatabaseMock';
import { UserBusiness } from './../../src/business/UserBusiness';
import { SignupInputDTO } from './../../src/dtos/userDTO';

describe("signup", () => {

    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("deve retornar um token caso o cadastro seja bem-sucedido", async () => {
        const input: SignupInputDTO = {
            name: "Example Mock",
            email: "example@email.com",
            password: "bananinha"
        }

        const response = await userBusiness.signup(input)
        expect(response.token).toBe("token-mock-normal")
    })

    test("deve disparar um erro caso name não seja string", async () => {
        expect.assertions(2)
        
        try {
            const input: SignupInputDTO = {
                email: "example@email.com",
                name: null,
                password: "bananinha"
            }

            await userBusiness.signup(input)

        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("'name' deve ser string")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar um erro caso email não seja string", async () => {
        expect.assertions(2)
        
        try {
            const input: SignupInputDTO = {
                email: null,
                name: "Example Mock",
                password: "bananinha"
            }

            await userBusiness.signup(input)

        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("'email' deve ser string")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar um erro caso password não seja string", async () => {
        expect.assertions(2)
        
        try {
            const input: SignupInputDTO = {
                email: "example@email.com",
                name: "Example Mock",
                password: null
            }

            await userBusiness.signup(input)

        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("'password' deve ser string")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar um erro caso o email já esteja cadastrado", async () => {
        expect.assertions(2)
        
        try {
            const input: SignupInputDTO = {
                email: "normal@email.com",
                name: "Example Mock",
                password: "bananinha"
            }

            await userBusiness.signup(input)

        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("'email' já existe")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})