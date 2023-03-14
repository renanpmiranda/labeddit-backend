import { NotFoundError } from './../../src/errors/NotFoundError';
import { BadRequestError } from './../../src/errors/BadRequestError';
import { EditPostInput } from './../../src/dtos/postDTO';
import { TokenManagerMock } from './../mocks/TokenManagerMock';
import { IdGeneratorMock } from './../mocks/IdGeneratorMock';
import { PostDatabaseMock } from './../mocks/PostDatabaseMock';
import { PostBusiness } from './../../src/business/PostBusiness';

describe("editPost", () => {

    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()        
    )

    test("deve retornar uma mensagem de sucesso e o post editado", async () => {
        const input: EditPostInput = {
            idToEdit: "postId-mock1",
            newContent: "Post de Teste 1 Editado",
            token: "token-mock-normal"
        }

        const response = await postBusiness.editPost(input)

        expect(response.message).toBe("Post editado com sucesso")
        expect(response.content).toBe("Post de Teste 1 Editado")
    })

    test("deve disparar um erro caso o conteúdo do post seja undefined", async () => {
        try {
            const input: EditPostInput = {
                idToEdit: "postId-mock1",
                newContent: undefined,
                token: "token-mock-normal"
            }
    
            await postBusiness.editPost(input)
    
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("'content' não pode ser nulo")
                expect(error.statusCode).toBe(400)
            }
        }        
    })

    test("deve disparar um erro caso o novo conteúdo do post não seja uma string", async () => {
        try {
            const input: EditPostInput = {
                idToEdit: "postId-mock1",
                newContent: 1,
                token: "token-mock-normal"
            }
    
            await postBusiness.editPost(input)
    
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("'content' deve ser string")
                expect(error.statusCode).toBe(400)
            }
        }        
    })

    test("deve disparar um erro caso o token não seja uma string", async () => {
        try {
            const input: EditPostInput = {
                idToEdit: "postId-mock1",
                newContent: "Post de Teste 1 Editado",
                token: 1
            }
    
            await postBusiness.editPost(input)
    
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("'token' inválido. Deve ser uma string")
                expect(error.statusCode).toBe(400)
            }
        }        
    })

    test("deve disparar um erro caso o token seja inválido", async () => {
        try {
            const input: EditPostInput = {
                idToEdit: "postId-mock1",
                newContent: "Post de Teste 1 Editado",
                token: "token-mock-invalido"
            }

            await postBusiness.editPost(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'token' inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })   
    
    test("deve disparar um erro caso o id do post não seja encontrado", async () => {
        try{
            const input: EditPostInput = {
                idToEdit: "postId-mock-inexistente",
                newContent: "Post de Teste 1 Editado",
                token: "token-mock-normal"
            }

            await postBusiness.editPost(input)

        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.message).toBe("Post não encontrado")
                expect(error.statusCode).toBe(404)
            }
        }
    })

    test("deve disparar um erro caso o id de usuário não seja o mesmo do autor do post", async () => {
        try {
            const input: EditPostInput = {
                idToEdit: "postId-mock2",
                newContent: "Post de Teste 1 Editado",
                token: "token-mock-normal"
            }

            await postBusiness.editPost(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("Apenas o autor pode editar o post")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})