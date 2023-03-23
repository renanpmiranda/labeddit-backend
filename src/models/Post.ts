import { PostDB, PostModel } from './../types';

export class Post {
    constructor(
        private id: string,
        private creator_id: string,
        private content: string,
        private likes: number,
        private dislikes: number,
        private created_at: string,
        private updated_at: string,        
        private creator_name: string
    ) {}

    public getId = (): string => {
        return this.id
    }
    public setId = (newId: string) => {
        this.id = newId
    }

    public getCreatorId = (): string => {
        return this.creator_id
    }
    public setCreatorId = (newCreatorId: string) => {
        this.creator_id = newCreatorId
    }

    public getContent = (): string => {
        return this.content
    }
    public setContent = (newContent: string) => {
        this.content = newContent
    }

    public getLikes = (): number => {
        return this.likes
    }
    public setLikes = (newLikes: number) => {
        this.likes = newLikes
    }
    public addLike() {
        this.likes += 1
    }
    public removeLike() {
        this.likes -= 1
    }

    public getDislikes = (): number => {
        return this.dislikes
    }
    public setDislikes = (newDislikes: number) => {
        this.dislikes = newDislikes
    }
    public addDislike() {
        this.dislikes += 1
    }
    public removeDislike() {
        this.dislikes -= 1
    }

    public getCreatedAt = (): string => {
        return this.created_at
    }
    public setCreatedAt = (newCreatedAt: string) => {
        this.created_at = newCreatedAt
    }

    public getUpdatedAt = (): string => {
        return this.updated_at
    }
    public setUpdatedAt = (newUpdatedAt: string) => {
        this.updated_at = newUpdatedAt
    }

    public getCreatorName(): string {
        return this.creator_name
    }
    public setCreatorName(newCreatorName: string): void {
        this.creator_name = newCreatorName
    }

    public toDBModel(): PostDB {
        return {
            id: this.id,
            creator_id: this.creator_id,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            created_at: this.created_at,
            updated_at: this.updated_at,
            creator_name: this.creator_name
        }
    }

    public toBusinessModel(): PostModel {
        return {
            id: this.id,
            creatorId: this.creator_id,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            createdAt: this.created_at,
            updatedAt: this.updated_at,
            creatorName: this.creator_name
        }
    }
}