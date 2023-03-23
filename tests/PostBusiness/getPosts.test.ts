import { BadRequestError } from './../../src/errors/BadRequestError';
import { GetPostsInput } from './../../src/dtos/postDTO';
import { TokenManagerMock } from './../mocks/TokenManagerMock';
import { IdGeneratorMock } from './../mocks/IdGeneratorMock';
import { PostDatabaseMock } from './../mocks/PostDatabaseMock';
import { PostBusiness } from './../../src/business/PostBusiness';

describe("getPosts", () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()        
    )

    test("deve retornar uma lista de posts", async () => {
        const input: GetPostsInput = {            
            token: "token-mock-normal"
        }

        const response = await postBusiness.getPosts(input)
        expect(response).toHaveLength(2)
        expect(response).toContainEqual({
            id: "postId-mock1",
            creatorId: "creatorId-mock1",
            content: "Post de Teste 1",
            likes: 1,
            dislikes: 0,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            creatorName: "Normal Mock"                                      
        })       
    })

    test("deve disparar um erro caso o token não seja uma string", async () => {
        try {
            const input: GetPostsInput = {
                token: null
            }
    
            await postBusiness.getPosts(input)
    
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("'token' deve ser string")
                expect(error.statusCode).toBe(400)
            }
        }        
    })

    test("deve disparar um erro caso o token seja inválido", async () => {
        try {
            const input: GetPostsInput = {                
                token: "token-mock-invalido"
            }

            await postBusiness.getPosts(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'token' inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })    
})