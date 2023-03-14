import { NotFoundError } from './../../src/errors/NotFoundError';
import { BadRequestError } from './../../src/errors/BadRequestError';
import { CommentPostInputDTO } from './../../src/dtos/userDTO';
import { TokenManagerMock } from './../mocks/TokenManagerMock';
import { IdGeneratorMock } from './../mocks/IdGeneratorMock';
import { PostDatabaseMock } from './../mocks/PostDatabaseMock';
import { PostBusiness } from './../../src/business/PostBusiness';

describe("addCommentToPost", () => {

    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()        
    )

    test("não deve ter retorno", async () => {
        const input: CommentPostInputDTO = {
            idToAddComment:"postId-mock1",
            token: "token-mock-normal",
            content: "Comentário de Teste"
        }

        const response = await postBusiness.addCommentToPost(input)

        expect(response).toBe(undefined)
    })

    test("deve disparar um erro caso o token não seja uma string", async () => {
        try {
            const input: CommentPostInputDTO = {
                idToAddComment:"postId-mock1",
                token: 1,
                content: "Comentário de Teste"
            }
    
            await postBusiness.addCommentToPost(input)
    
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("'token' inválido. Deve ser uma string")
                expect(error.statusCode).toBe(400)
            }
        }        
    })

    test("deve disparar um erro caso o token seja inválido", async () => {
        try {
            const input: CommentPostInputDTO = {
                idToAddComment:"postId-mock1",
                token: "token-mock-inválido",
                content: "Comentário de Teste"
            }

            await postBusiness.addCommentToPost(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'token' inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar um erro caso o conteúdo não seja uma string", async () => {
        try {
            const input: CommentPostInputDTO = {
                idToAddComment:"postId-mock1",
                token: "token-mock-normal",
                content: 1
            }

            await postBusiness.addCommentToPost(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'content' inválido. Deve ser uma string")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar um erro caso o conteúdo não tenha pelo menos 1 caractere", async () => {
        try {
            const input: CommentPostInputDTO = {
                idToAddComment:"postId-mock1",
                token: "token-mock-normal",
                content:""
            }

            await postBusiness.addCommentToPost(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'content' deve possuir pelo menos um caractere")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar um erro caso o id do post não seja encontrado", async () => {
        try{
            const input: CommentPostInputDTO = {
                idToAddComment:"postId-mock-inexistente",
                token: "token-mock-normal",
                content: "Comentário de Teste"
            }

            await postBusiness.addCommentToPost(input)

        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.message).toBe("'id' não encontrado")
                expect(error.statusCode).toBe(404)
            }
        }
    })
})