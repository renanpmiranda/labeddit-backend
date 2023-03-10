import { LikeDislikeDB, PostDB, POST_LIKE, PostWithCreatorDB, CommentDB } from './../types';
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {

    public static TABLE_POSTS = "posts" 
    public static TABLE_LIKES_DISLIKES_POST = "likes_dislikes_post" 
    public static TABLE_COMMENTS = "comments"  
    
    public getPostsWithCreators = async (): Promise<PostWithCreatorDB[]> => {
        const result: PostWithCreatorDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select(
                "posts.id",
                    "posts.creator_id",
                    "posts.content",
                    "posts.likes",
                    "posts.dislikes",
                    "posts.created_at",
                    "posts.updated_at",
                    "users.name AS creator_name"
                )
            .join("users", "posts.creator_id", "=", "users.id")
        
        return result        
    }

    public async insertPost(newPostDB: PostDB) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .insert(newPostDB)
    }

    public async findPostById(id: string) {
        const postDB: PostDB[] | undefined[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select()
            .where({ id })

        return postDB[0]
    }

    public async updatePost(id: string, postDB: PostDB) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .update(postDB)
            .where({ id })
    }

    public async deletePost(id: string) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .del()
            .where({ id })
    }    

    public findPostWithCreatorById = async (postId: string): Promise<PostWithCreatorDB | undefined> => {
        const result: PostWithCreatorDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select(
                "posts.id",
                "posts.creator_id",
                "posts.content",
                "posts.likes",
                "posts.dislikes",
                "posts.created_at",
                "posts.updated_at",
                "users.name AS creator_name"
            )
            .join("users", "posts.creator_id", "=", "users.id")
            .where("posts.id", postId)
        
        return result[0]
    }

    public likeOrDislikePost = async (likeDislike: LikeDislikeDB): Promise<void> => {
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES_POST)
            .insert(likeDislike)
    }

    public findLikeDislike = async (likeDislikeDBToFind: LikeDislikeDB): Promise<POST_LIKE | null> => {
        const [ likeDislikeDB ]: LikeDislikeDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES_POST)
            .select()
            .where({
                user_id: likeDislikeDBToFind.user_id,
                post_id: likeDislikeDBToFind.post_id
            })

            if (likeDislikeDB) {
                return likeDislikeDB.like === 1
                    ? POST_LIKE.ALREADY_LIKED
                    : POST_LIKE.ALREADY_DISLIKED
            } else {
                return null
            }
    }

    public removeLikeDislike = async (likeDislikeDB: LikeDislikeDB): Promise<void> => {
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES_POST)
            .del()
            .where({
                user_id: likeDislikeDB.user_id,
                post_id: likeDislikeDB.post_id
            })
    }

    public updateLikeDislike = async (likeDislikeDB: LikeDislikeDB) => {
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES_POST)
            .update(likeDislikeDB)
            .where({
                user_id: likeDislikeDB.user_id,
                post_id: likeDislikeDB.post_id
            })
    }

    public commentPost = async (newCommentDB: CommentDB) => {
        await BaseDatabase.connection(PostDatabase.TABLE_COMMENTS)
            .insert(newCommentDB)
    }
}