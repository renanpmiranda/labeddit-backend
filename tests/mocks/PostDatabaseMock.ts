import { PostWithCreatorDB, PostDB, LikeDislikeDB, POST_LIKE, CommentDB } from './../../src/types';
import { BaseDatabase } from "../../src/database/BaseDatabase"

export class PostDatabaseMock extends BaseDatabase {
    public static TABLE_POSTS = "posts"
    public static TABLE_LIKES_DISLIKES_POST = "likes_dislikes_post" 
    public static TABLE_COMMENTS = "comments" 

    public getPostsWithCreators = async (): Promise<PostWithCreatorDB[]> => {
        return [
            {
                id: "postId-mock1",
                creator_id: "creatorId-mock1",
                content: "Post de Teste 1",
                likes: 1,
                dislikes: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                creator_name: "Normal Mock"
            },
            {
                id: "postId-mock2",
                creator_id: "creatorId-mock2",
                content: "Post de Teste 2",
                likes: 3,
                dislikes: 2,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                creator_name: "Admin Mock"
            }
        ]
    }

    public insertPost = async (newPostDB: PostDB): Promise<void> => {
        
    }

    public findPostById = async (id: string): Promise<PostDB | undefined> => {
        switch (id) {
            case "postId-mock1":
                return {
                    id: "postId-mock1",
                    creator_id: "creatorId-mock1",
                    content: "Post de Teste 1",
                    likes: 1,
                    dislikes: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    creator_name: "Normal Mock"                   
                }
            case "postId-mock2":
                return {
                    id: "postId-mock2",
                    creator_id: "creatorId-mock2",
                    content: "Post de Teste 2",
                    likes: 3,
                    dislikes: 2,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    creator_name: "Admin Mock"                    
                }
            default:
                return undefined
        }
    }

    public updatePost = async (id: string, postDB: PostDB): Promise<void> => {

    }

    public deletePost = async (id: string): Promise <void> => {

    }

    public findPostWithCreatorById = async (postId: string): Promise<PostWithCreatorDB | undefined> => {
        switch (postId) {
            case "postId-mock1":
                return {
                    id: "postId-mock1",
                    creator_id: "creatorId-mock1",
                    content: "Post de Teste 1",
                    likes: 1,
                    dislikes: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    creator_name: "Normal Mock"                    
                }
            case "postId-mock2":
                return {
                    id: "postId-mock2",
                    creator_id: "creatorId-mock2",
                    content: "Post de Teste 2",
                    likes: 3,
                    dislikes: 2,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    creator_name: "Admin Mock"
                }
            default:
                return undefined
        }
    }

    public likeOrDislikePost = async (likeDislike: LikeDislikeDB): Promise<void> => {
    
    }

    public findLikeDislike = async (likeDislikeDBToFind: LikeDislikeDB): Promise<POST_LIKE | null> => {
        if (likeDislikeDBToFind.like === 1){
            return POST_LIKE.ALREADY_LIKED
        } else if (likeDislikeDBToFind.like === 0) {
            return POST_LIKE.ALREADY_DISLIKED
        } else {
            return null
        }        
    }

    public removeLikeDislike = async (likeDislikeDB: LikeDislikeDB): Promise<void> => {
    
    }

    public updateLikeDislike = async (likeDislikeDB: LikeDislikeDB): Promise<void> => {
    
    }

    public commentPost = async (newCommentDB: CommentDB): Promise <void> => {
    
    }
}