import { NotFoundError } from './../../src/errors/NotFoundError';
import { BadRequestError } from './../../src/errors/BadRequestError';
import { LikeOrDislikePostInputDTO } from './../../src/dtos/userDTO';
import { TokenManagerMock } from './../mocks/TokenManagerMock';
import { IdGeneratorMock } from './../mocks/IdGeneratorMock';
import { PostDatabaseMock } from './../mocks/PostDatabaseMock';
import { PostBusiness } from './../../src/business/PostBusiness';

describe("likeOrDislikePost", () => {

    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()        
    )

    test("não deve ter retorno", async () => {
        const input: LikeOrDislikePostInputDTO = {
            idToLikeOrDislike: "postId-mock1",
            token: "token-mock-normal",
            like: true
        }

        const response = await postBusiness.likeOrDislikePost(input)

        expect(response).toBe(undefined)
    })

    test("deve disparar um erro caso o token não seja uma string", async () => {
        try {
            const input: LikeOrDislikePostInputDTO = {
                idToLikeOrDislike: "postId-mock1",
                token: 1,
                like: true
            }
    
            await postBusiness.likeOrDislikePost(input)
    
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("'token' inválido. Deve ser uma string")
                expect(error.statusCode).toBe(400)
            }
        }        
    })

    test("deve disparar um erro caso o token seja inválido", async () => {
        try {
            const input: LikeOrDislikePostInputDTO = {
                idToLikeOrDislike: "postId-mock1",
                token: "token-mock-invalido",
                like: true
            }

            await postBusiness.likeOrDislikePost(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'token' inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })
    
    test("deve disparar um erro caso o like não seja booleano", async () => {
        try {
            const input: LikeOrDislikePostInputDTO = {
                idToLikeOrDislike: "postId-mock1",
                token: "token-mock-normal",
                like: "true"
            }

            await postBusiness.likeOrDislikePost(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'like' deve ser boolean")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar um erro caso o id do post não seja encontrado", async () => {
        try{
            const input: LikeOrDislikePostInputDTO = {
                idToLikeOrDislike: "postId-mock-inexistente",
                token: "token-mock-normal",
                like: true
            }

            await postBusiness.likeOrDislikePost(input)

        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.message).toBe("'id' não encontrado")
                expect(error.statusCode).toBe(404)
            }
        }
    })
})