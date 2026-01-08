import { Repository } from "../models/repository.model.js";
import { StatusCodes } from "http-status-codes";
import { ROLE_PERMISSIONS, PERMISSION_LEVELS } from "../constants/roles.js";

export const checkWorkspacePermission = (requiredRole) =>{
    return async (req,res,next) => {
        try {
            
            const userId = req.user.id;
            const workspaceId = req.params.repoId || req.params.id;

            const workspace = await Repository.findOne({
                _id:workspaceId,
                "members.userId":userId,
            });

            if(!workspace){
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    success:false,
                    message:"You are not a member of this workspace",
                })
            }

            const member = workspace.members.find((member) => member.userId.toString() === userId.toString());

            const userRole = member.role;

            // getting list of permissions for the user role
            const userPermissions = ROLE_PERMISSIONS[userRole] || [];

            // determing the highest level of permission the user currently has
            const userPermissionLevel = Math.max(...userPermissions.map((permission) => PERMISSION_LEVELS[permission]), 0);

            // determing the highest level of permission required for the action
            const requiredPermissionLevel = PERMISSION_LEVELS[requiredRole];

            // comparing levels
            if (userPermissionLevel < requiredPermissionLevel){
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    success:false,
                    message:`Permission Denied: This action requires ${requiredRole} role`,
                })
            }
            // attach repo to request to avoid re-fetchig in the controller
            req.workspace = workspace;
            
            next();
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:`Internal Server Error: ${error.message}`,
            })
        }
    }
}