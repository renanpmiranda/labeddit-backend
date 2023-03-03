import { LikeDB } from './../types';
import { BaseDatabase } from "./BaseDatabase";

export class LikeDatabase extends BaseDatabase {

    public static TABLE_LIKES = "likes_dislikes"    

    public async insertLike(newLikeDB: LikeDB) {
        await BaseDatabase
            .connection(LikeDatabase.TABLE_LIKES)
            .insert(newLikeDB)
    }
}