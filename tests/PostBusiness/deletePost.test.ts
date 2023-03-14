import { NotFoundError } from './../../src/errors/NotFoundError';
import { BadRequestError } from './../../src/errors/BadRequestError';
import { DeletePostInput } from './../../src/dtos/postDTO';
import { TokenManagerMock } from './../mocks/TokenManagerMock';
import { IdGeneratorMock } from './../mocks/IdGeneratorMock';
import { PostDatabaseMock } from './../mocks/PostDatabaseMock';
import { PostBusiness } from './../../src/business/PostBusiness';

describe("deletePost", () => {

    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()        
    )

    test("deve retornar uma mensagem de sucesso", async () => {
        const input: DeletePostInput = {
            idToDelete: "postId-mock1",
            token: "token-mock-normal"
        }

        const response = await postBusiness.deletePost(input)

        expect(response.message).toBe("Post deletado com sucesso")
    })

    test("deve disparar um erro caso o token não seja uma string", async () => {
        try {
            const input: DeletePostInput = {
                idToDelete: "postId-mock1",
                token: 1
            }
    
            await postBusiness.deletePost(input)
    
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("'token' inválido. Deve ser uma string")
                expect(error.statusCode).toBe(400)
            }
        }        
    })

    test("deve disparar um erro caso o token seja inválido", async () => {
        try {
            const input: DeletePostInput = {
                idToDelete: "postId-mock1",
                token: "token-mock-invalido"
            }

            await postBusiness.deletePost(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'token' inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar um erro caso o id do post não seja encontrado", async () => {
        try{
            const input: DeletePostInput = {
                idToDelete: "postId-mock-inexistente",
                token: "token-mock-normal"
            }

            await postBusiness.deletePost(input)

        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.message).toBe("Post não encontrado")
                expect(error.statusCode).toBe(404)
            }
        }
    })

    test("deve disparar um erro caso o id de usuário não seja o mesmo do autor do post", async () => {
        try {
            const input: DeletePostInput = {
                idToDelete: "postId-mock2",
                token: "token-mock-normal"
            }

            await postBusiness.deletePost(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("Apenas o autor pode deletar o post")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})