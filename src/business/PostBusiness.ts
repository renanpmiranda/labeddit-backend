import { TokenManager } from './../services/TokenManager';
import { PostDatabase } from './../database/PostDatabase';
import { NotFoundError } from './../errors/NotFoundError';
import { IdGenerator } from './../services/IdGenerator';
import { BadRequestError } from './../errors/BadRequestError';
import { GetPostsInput, GetPostsOutput, CreatePostInput, CreatePostOutput, EditPostInput, EditPostOutput, DeletePostInput, DeletePostOutput } from './../dtos/postDTO';
import { Post } from './../models/Post';
import { PostDB, USER_ROLES } from './../types';

export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager        
    ) {}

    public getPosts = async (input: GetPostsInput): Promise<GetPostsOutput> => {
        const { q, token } = input

        if (typeof q !== "string" && q !== undefined) {
            throw new BadRequestError("'q' deve ser string ou undefined")
        }

        if (typeof token !== "string"){
            throw new BadRequestError("'token' inválido")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null){
            throw new BadRequestError("'token' inválido")
        }

        const postsDB = await this.postDatabase.findPosts(q)

        const posts = postsDB.map((postDB) => {
            const post = new Post(
                postDB.id,
                postDB.creator_id,
                postDB.content,
                postDB.likes,
                postDB.dislikes,
                postDB.created_at,
                postDB.updated_at
            )

            return post.toBusinessModel()
        })

        const output: GetPostsOutput = posts

        return output
    }

    public createPost = async (input: CreatePostInput) => {
        const { content, token } = input

        if (content === undefined) {
            throw new BadRequestError("'content' deve possuir pelo menos 1 caractere")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser string")
        }

        if (typeof token !== "string"){
            throw new BadRequestError("'token' inválido. Deve ser uma string")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null){
            throw new BadRequestError("'token' inválido")
        }

        const id = this.idGenerator.generate()

        const newPost = new Post(
            id,
            payload.id,
            content,
            0,
            0,            
            new Date().toISOString(),
            new Date().toISOString()
        )

        const newPostDB = newPost.toDBModel()
        await this.postDatabase.insertPost(newPostDB) 
        
        const output: CreatePostOutput ={
            message: "Post criado com sucesso",
            content
        }

        return output
    }

    public editPost = async (input: EditPostInput) => {
        const { idToEdit, newContent, token } = input        

        if (newContent === undefined) {
            throw new BadRequestError("'content' não pode ser nulo")
        }

        if (typeof newContent !== "string") {
            throw new BadRequestError("'content' deve ser string")
        }

        if (typeof token !== "string"){
            throw new BadRequestError("'token' inválido. Deve ser uma string")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null){
            throw new BadRequestError("'token' inválido")
        }

        const postDB = await this.postDatabase.findPostById(idToEdit)

        if (!postDB) {
            throw new NotFoundError("Post não encontrado")
        }

        if (postDB.creator_id !== payload.id){
            throw new BadRequestError("Apenas o autor pode editar o post")
        }

        const post = new Post(
            postDB.id,
            postDB.creator_id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at
        )

        post.setContent(newContent)

        const updatedPostDB: PostDB = {
            id: post.getId(),
            creator_id: post.getCreatorId(),
            content: post.getContent(),
            likes: post.getLikes(),
            dislikes: post.getDislikes(),
            created_at: post.getCreatedAt(),
            updated_at: post.getUpdatedAt()
        }

        await this.postDatabase.updatePost(updatedPostDB)

        const output: EditPostOutput = {
            message: "Post editado com sucesso",
            content: post.getContent()
        }

        return output
    }

    public deletePost = async (input: DeletePostInput) => {
        const { idToDelete, token } = input

        if (typeof token !== "string"){
            throw new BadRequestError("'token' inválido. Deve ser uma string")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null){
            throw new BadRequestError("'token' inválido")
        }

        const postDB = await this.postDatabase.findPostById(idToDelete)

        if (!postDB) {
            throw new NotFoundError("Post não encontrado")
        }

        if(payload.role !== USER_ROLES.ADMIN){
            if (postDB.creator_id !== payload.id){
                throw new BadRequestError("Apenas o autor pode deletar o post")
            }
        }        

        await this.postDatabase.deletePost(idToDelete)

        const output: DeletePostOutput = {
            message: "Post deletado com sucesso"
        }

        return output
    }
}