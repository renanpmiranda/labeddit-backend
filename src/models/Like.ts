import { LikeDB, LikeModel } from './../types';
export class Like {
    constructor(
        private user_id: string,
        private post_id: string,
        private like: number
    ) {}

    public getUserId = (): string => {
        return this.user_id
    }
    public setUserId = (newUserId: string) => {
        this.user_id = newUserId
    }

    public getPostId = (): string => {
        return this.post_id
    }
    public setPostId = (newPostId: string) => {
        this.post_id = newPostId
    }

    public getLike = (): number => {
        return this.like
    }
    public setLike = (newLike: number) => {
        this.like = newLike
    }

    public toDBModel(): LikeDB {
        return {
            user_id: this.user_id,
            post_id: this.post_id,
            like: this.like
        }
    }

    public toBusinessModel(): LikeModel {
        return {
            userId: this.user_id,
            postId: this.post_id,
            like: this.like
        }
    }
}