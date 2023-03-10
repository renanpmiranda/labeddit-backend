import { CommentDB, CommentModel } from './../types';

export class Comment {
    constructor(
        private user_id: string,
        private post_id: string,
        private content: string
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

    public getContent = (): string => {
        return this.content
    }
    public setContent = (newContent: string) => {
        this.user_id = newContent
    }

    public toDBModel(): CommentDB {
        return {
            user_id: this.user_id,
            post_id: this.post_id,
            content: this.content
        }
    }

    public toBusinessModel(): CommentModel {
        return {
            userId: this.user_id,
            postId: this.post_id,
            content: this.content
        }
    }
}