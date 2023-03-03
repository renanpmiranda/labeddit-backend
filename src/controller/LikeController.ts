import { LikeBusiness } from './../business/LikeBusiness';
import { Request, Response } from 'express';

export class LikeController {
    constructor(
        private likeBusiness: LikeBusiness
    ) {}

    public likeOrDislikePost = async (req: Request, res: Response) => {
        try {
            const input = {
                postId: req.params.id,
                token: req.headers.authorization
            }

            const output = await this.likeBusiness.createLike(input)

            res.send(200).send(output)

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