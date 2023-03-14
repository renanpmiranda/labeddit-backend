import { UserModel } from "../types"

export interface SignupInputDTO {
    name: unknown,
    email: unknown,
    password: unknown
}

export interface SignupOutputDTO {
    token: string
}

export interface LoginInputDTO {
    email: unknown,
    password: unknown
}

export interface LoginOutputDTO {
    token: string
}

export interface LikeOrDislikePostInputDTO {
    idToLikeOrDislike: string,
    token: unknown,
    like: unknown
}

export interface CommentPostInputDTO {
    idToAddComment: string,
    token: unknown,
    content: unknown
}