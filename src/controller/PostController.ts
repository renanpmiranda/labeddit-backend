import { LikeOrDislikePostInputDTO, CommentPostInputDTO } from './../dtos/userDTO';
import { Request, Response } from 'express';
import { PostBusiness } from '../business/PostBusiness';
import { GetPostsInput, CreatePostInput, EditPostInput, DeletePostInput } from './../dtos/postDTO';
import { BaseError } from '../errors/BaseError';

export class PostController {
    constructor(
        private postBusiness: PostBusiness
    ) {}

    public getPosts = async (req: Request, res: Response) => {
        try {
            const input: GetPostsInput = {                
                token: req.headers.authorization
            }

            const output = await this.postBusiness.getPosts(input)

            res.status(200).send(output)

        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public createPost = async (req: Request, res: Response) => {
        try {
            const input: CreatePostInput = {
                content: req.body.content,
                token: req.headers.authorization
            }

            const output = await this.postBusiness.createPost(input)
            
            res.status(201).send(output)

        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public editPost = async (req: Request, res: Response) => {
        try {
            const input: EditPostInput = {
                idToEdit: req.params.id,
                newContent: req.body.content,
                token: req.headers.authorization
            }

            const output = await this.postBusiness.editPost(input)

            res.status(200).send(output)

        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public deletePost = async (req: Request, res: Response) => {
        try {
            const input: DeletePostInput = {
                idToDelete: req.params.id,
                token: req.headers.authorization
            }

            const output = await this.postBusiness.deletePost(input)

            res.status(200).send(output)

        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public likeOrDislikePost = async (req: Request, res: Response) => {
        try {
            const input: LikeOrDislikePostInputDTO = {
                idToLikeOrDislike: req.params.id,
                token: req.headers.authorization,
                like: req.body.like
            }

            await this.postBusiness.likeOrDislikePost(input)

            res.status(200).end()

        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public addCommentToPost = async (req: Request, res: Response) => {
        try {
            const input: CommentPostInputDTO = {
                idToAddComment: req.params.id,
                token: req.headers.authorization,
                content: req.body.content
            }

            await this.postBusiness.addCommentToPost(input)

            res.status(200).end()

        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
}