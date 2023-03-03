import { LikeDatabase } from './../database/LikeDatabase';
import express from "express";
import { LikeBusiness } from "../business/LikeBusiness";
import { LikeController } from './../controller/LikeController';
import { PostDatabase } from '../database/PostDatabase';
import { TokenManager } from '../services/TokenManager';

export const likeRouter = express.Router()

const likeController = new LikeController(
    new LikeBusiness(
        new LikeDatabase(),
        new PostDatabase(),
        new TokenManager()       
    )
)

likeRouter.post("/:id", likeController.likeOrDislikePost)