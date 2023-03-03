import { Request, Response } from 'express';
import { PostBusiness } from '../business/PostBusiness';
import { GetPostsInput, CreatePostInput, EditPostInput, DeletePostInput } from './../dtos/postDTO';

export class PostController {
    constructor(
        private postBusiness: PostBusiness
    ) {}

    public getPosts = async (req: Request, res: Response) => {
        try {
            const input: GetPostsInput = {
                q: req.query.q as string,
                token: req.headers.authorization
            }

            const output = await this.postBusiness.getPosts(input)

            res.status(200).send(output)

        } catch (error) {
            console.log(error)
    
            if (req.statusCode === 200) {
                res.status(500)
            }
    
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
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
    
            if (req.statusCode === 200) {
                res.status(500)
            }
    
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
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
    
            if (req.statusCode === 200) {
                res.status(500)
            }
    
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
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
    
            if (req.statusCode === 200) {
                res.status(500)
            }
    
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }
}