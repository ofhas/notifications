import express from "express";
import { User } from "../modules/users/types";

export interface Context {
    user: User
}

export interface RequestWithCtx extends express.Request {
    authContext: Context
    token: string
}