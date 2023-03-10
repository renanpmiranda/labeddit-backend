import { BadRequestError } from './../../src/errors/BadRequestError';
import { CreatePostInput } from './../../src/dtos/postDTO';
import { TokenManagerMock } from './../mocks/TokenManagerMock';
import { IdGeneratorMock } from './../mocks/IdGeneratorMock';
import { PostDatabaseMock } from './../mocks/PostDatabaseMock';
import { PostBusiness } from './../../src/business/PostBusiness';

describe("createPost", () => {

    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()        
    )

    test("deve retornar uma mensagem de sucesso e o conteúdo do novo post", async () => {
        const input: CreatePostInput = {
            content: "Novo Post de Teste",
            token: "token-mock-normal"
        }

        const response = await postBusiness.createPost(input)
        expect(response.message).toBe("Post criado com sucesso")
        expect(response.content).toBe("Novo Post de Teste")
    })

    test("deve disparar um erro caso o conteúdo do post não tenha pelo menos 1 caractere", async () => {
        try {
            const input: CreatePostInput = {
                content: undefined,
                token: "token-mock-normal"
            }
    
            await postBusiness.createPost(input)
    
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("'content' deve possuir pelo menos 1 caractere")
                expect(error.statusCode).toBe(400)
            }
        }        
    })

    test("deve disparar um erro caso o conteúdo não seja uma string", async () => {
        try {
            const input: CreatePostInput = {
                content: 1,
                token: "token-mock-normal"
            }
    
            await postBusiness.createPost(input)
    
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("'content' deve ser string")
                expect(error.statusCode).toBe(400)
            }
        }        
    })

    test("deve disparar um erro caso o token não seja uma string", async () => {
        try {
            const input: CreatePostInput = {
                content: "Novo Post de Teste",
                token: null
            }
    
            await postBusiness.createPost(input)
    
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("'token' inválido. Deve ser uma string")
                expect(error.statusCode).toBe(400)
            }
        }        
    })

    test("deve disparar um erro caso o token seja inválido", async () => {
        try {
            const input: CreatePostInput = { 
                content: "Novo Post de Teste",               
                token: "token-mock-invalido"
            }

            await postBusiness.createPost(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'token' inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })    
})