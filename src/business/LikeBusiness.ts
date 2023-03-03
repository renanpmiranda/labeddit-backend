import { Like } from './../models/Like';
import { USER_ROLES } from './../types';
import { NotFoundError } from './../errors/NotFoundError';
import { PostDatabase } from './../database/PostDatabase';
import { BadRequestError } from './../errors/BadRequestError';
import { LikeDatabase } from './../database/LikeDatabase';
import { TokenManager } from './../services/TokenManager';

export class LikeBusiness {
    constructor(
        private likeDatabase: LikeDatabase,   
        private postDatabase: PostDatabase,     
        private tokenManager: TokenManager        
    ) {}

    public createLike = async (input: any) => {
        const { postId, token } = input
        
        if (typeof token !== "string"){
            throw new BadRequestError("'token' inválido. Deve ser uma string")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null){
            throw new BadRequestError("'token' inválido")
        }

        const postDB = await this.postDatabase.findPostById(postId)

        if (!postDB) {
            throw new NotFoundError("Post não encontrado")
        }

        if(payload.role !== USER_ROLES.ADMIN){
            if (postDB.creator_id !== payload.id){
                throw new BadRequestError("Apenas o autor pode deletar o post")
            }
        }       
    
        const newLike = new Like (
            payload.id,
            postId,
            1
        )

        const newLikeDB = newLike.toDBModel()
        await this.likeDatabase.insertLike(newLikeDB)         
        
        const output ={
            message: "Like criado com sucesso"
        }

        return output
    }
}