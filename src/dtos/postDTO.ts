import { PostModel } from './../types';

export interface GetPostsInput {    
    token: unknown
}

export type GetPostsOutput = PostModel[]

export interface CreatePostInput {
    content: unknown,
    token: unknown
}

export interface CreatePostOutput {
    message: string,
    content: string
}

export interface EditPostInput {
    idToEdit: string,
    newContent: unknown,
    token: string | undefined
}

export interface EditPostOutput {
    message: string,
    content: string
}

export interface DeletePostInput {
    idToDelete: string,
    token: string | undefined
}

export interface DeletePostOutput {
    message: string
}