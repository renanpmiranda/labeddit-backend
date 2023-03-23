import { Comment } from './../models/Comment';
import { LikeOrDislikePostInputDTO, CommentPostInputDTO } from './../dtos/userDTO';
import { TokenManager } from './../services/TokenManager';
import { PostDatabase } from './../database/PostDatabase';
import { NotFoundError } from './../errors/NotFoundError';
import { IdGenerator } from './../services/IdGenerator';
import { BadRequestError } from './../errors/BadRequestError';
import { GetPostsInput, GetPostsOutput, CreatePostInput, CreatePostOutput, EditPostInput, EditPostOutput, DeletePostInput, DeletePostOutput } from './../dtos/postDTO';
import { Post } from './../models/Post';
import { PostDB, USER_ROLES, LikeDislikeDB, PostWithCreatorDB, POST_LIKE } from './../types';

export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager        
    ) {}

    public getPosts = async (input: GetPostsInput): Promise<GetPostsOutput> => {
        const { token } = input        

        if (typeof token !== "string"){
            throw new BadRequestError("'token' deve ser string")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null){
            throw new BadRequestError("'token' inválido")
        }

        const postsWithCreatorDB: PostWithCreatorDB[] = await this.postDatabase.getPostsWithCreators()

        const posts = postsWithCreatorDB.map((postWithCreatorDB) => {
            const post = new Post(
                postWithCreatorDB.id,
                postWithCreatorDB.creator_id,
                postWithCreatorDB.content,
                postWithCreatorDB.likes,
                postWithCreatorDB.dislikes,
                postWithCreatorDB.created_at,
                postWithCreatorDB.updated_at,                
                postWithCreatorDB.creator_name
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
            new Date().toISOString(),
            payload.name
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
            postDB.updated_at,
            payload.name
        )

        post.setContent(newContent)

        const updatedPostDB: PostDB = {
            id: post.getId(),
            creator_id: post.getCreatorId(),
            content: post.getContent(),
            likes: post.getLikes(),
            dislikes: post.getDislikes(),
            created_at: post.getCreatedAt(),
            updated_at: post.getUpdatedAt(),
            creator_name: post.getCreatorName()
        }

        await this.postDatabase.updatePost(idToEdit, updatedPostDB)

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

    public likeOrDislikePost = async (input: LikeOrDislikePostInputDTO): Promise <void> => {
        const { idToLikeOrDislike, token, like } = input

        if (typeof token !== "string"){
            throw new BadRequestError("'token' inválido. Deve ser uma string")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null){
            throw new BadRequestError("'token' inválido")
        }

        if (typeof like !== "boolean") {
            throw new BadRequestError("'like' deve ser boolean")
        }

        const postWithCreatorDB = await this.postDatabase
            .findPostWithCreatorById(idToLikeOrDislike)
        
        if (!postWithCreatorDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const userId = payload.id
        const likeSQLite = like ? 1 : 0

        const likeDislikeDB: LikeDislikeDB = {
            user_id: userId,
            post_id: postWithCreatorDB.id,
            like: likeSQLite
        }

        const post = new Post(
            postWithCreatorDB.id,
            postWithCreatorDB.creator_id,
            postWithCreatorDB.content,
            postWithCreatorDB.likes,
            postWithCreatorDB.dislikes,
            postWithCreatorDB.created_at,
            postWithCreatorDB.updated_at,
            postWithCreatorDB.creator_name
        )

        const likeDislikeExists = await this.postDatabase.findLikeDislike(likeDislikeDB)

        if(likeDislikeExists === POST_LIKE.ALREADY_LIKED) {
            if (like) {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeLike()
            } else {
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeLike()
                post.addDislike()
            }

        } else if (likeDislikeExists === POST_LIKE.ALREADY_DISLIKED) {
            if (like) {
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeDislike()
                post.addLike()
            } else {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeDislike()
            }

        } else {
            await this.postDatabase.likeOrDislikePost(likeDislikeDB)
            
            like ? post.addLike() : post.addDislike()
        }

        const updatedPostDB = post.toDBModel()

        await this.postDatabase.updatePost(idToLikeOrDislike, updatedPostDB)
    }

    public addCommentToPost = async (input: CommentPostInputDTO): Promise <void> => {
        const { idToAddComment, token, content } = input

        if (typeof token !== "string"){
            throw new BadRequestError("'token' inválido. Deve ser uma string")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null){
            throw new BadRequestError("'token' inválido")
        }

        if (typeof content !== "string"){
            throw new BadRequestError("'content' inválido. Deve ser uma string")
        }

        if (content.length <= 0){
            throw new BadRequestError("'content' deve possuir pelo menos um caractere")
        }

        const postWithCreatorDB = await this.postDatabase
            .findPostWithCreatorById(idToAddComment)
        
        if (!postWithCreatorDB) {
            throw new NotFoundError("'id' não encontrado")
        }        

        const comment = new Comment(
            payload.id, 
            postWithCreatorDB.id,
            content
        ).toDBModel()

        await this.postDatabase.commentPost(comment)
    }
}