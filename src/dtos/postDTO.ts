import { PostModel } from './../types';

export interface GetPostsInput {
    q: string,
    token: string | undefined
}

export type GetPostsOutput = PostModel[]

export interface CreatePostInput {
    content: unknown,
    token: string | undefined
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