import {auth} from "../config/betterAuth.js";
import { fromNodeHeaders } from "better-auth/node";

export const authMiddleware = async (req, res, next) =>{
    try {
        const session  = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });


        if(!session?.user){
            return res.status(401).json({message: "Unauthorized"});
        }

        req.user = session.user;
        req.session = session;
        next();
    } catch (error) {
        res.status(401).json({error: "Invalid session"});

    }
}