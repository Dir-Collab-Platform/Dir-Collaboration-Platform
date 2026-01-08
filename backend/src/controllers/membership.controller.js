import {User} from "../models/user.model.js";
import  {StatusCodes} from "http-status-codes";
import { Repository } from "../models/repository.model.js";
import {createLog} from "../utils/activity.util.js"
import { createNotification } from "../services/notification.service.js";


//@route /api/repos/:repoId/members
//@desc inviting a member
export const inviteMember = async (req,res) => {
    try {
        const {id:workspaceId} = req.params;
        const {githubUsername, role = "viewer"} = req.body;


        // the invited user must logged into dir
        const invitedUser = await User.findOne({githubUsername});
        if(!invitedUser) return res.status(StatusCodes.NOT_FOUND).json({
            status: "error",
            message: "User not found"
        })

        // looking for workspace that doesn't have the invited user
        


        const workspace = await Repository.findOneAndUpdate( 
            { 
              _id: workspaceId, 
              "members.userId": { $ne: invitedUser._id } 
            },
            {$push: 
                {members: {
                userId: invitedUser._id, 
                role:role
            }}},
            {new: true}
        );

        if (!workspace) {
            // If workspace is null, it's either a wrong ID or the user is already a member
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: "error",
                message: "Invitation failed: Either workspace not found or user is already a member"
            });
        }

        



        // persist and emit
        await createNotification({
            userId: invitedUser._id,
            message: `${req.user.githubUsername} added you to ${workspace.workspaceName}`,
            type: "message",
            repoId: workspaceId,
            targetType: "repository",
            targetId: workspaceId

        })

        // logging
        await createLog(
            req.user._id,
            workspace._id,
            "invited member",
            "user",
            invitedUser._id,
            `Invited ${githubUsername} as ${role} to join the workspace`
        );

        res.status(StatusCodes.OK).json({
            status: "success",
            message: `User ${githubUsername} has been invited successfully`,
            data: workspace.members
        })


        
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}

// @desc list all members
// @route GET /api/repos/:repoId/members - todo
export const listMembers = async (req, res) => {
    try {
        const { repoId } = req.params;
        // Find the repository and populate the members array with user details
        const workspace = await Repository.findById(repoId)
            .populate("members.userId", "githubUsername avatarUrl email")
            .select("members workspaceName");
        
        if (!workspace) return res.status(StatusCodes.NOT_FOUND).json({ message: "Workspace not found" });

        res.status(StatusCodes.OK).json({ status: "success", data: workspace.members });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

// @desc updating role
//@route PATCH /api/repos/:repoId/members/:userId
export const updateRole = async (req, res) => {
    try {
        const { repoId, userId: memberIdToUpdate } = req.params;
        const { role } = req.body; 
        
        // Match the membership schema's enum exactly
        const validRoles = ["owner", "core", "contributor", "viewer"];

        if (!validRoles.includes(role)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid role specified" });
        }

        // finding workspace to be updated

        const workspace = await Repository.findOneAndUpdate(
            { _id: repoId, "members.userId": memberIdToUpdate },
            { $set: { "members.$.role": role } },
            { new: true }
        ).select("members workspaceName");

        if (!workspace) return res.status(StatusCodes.NOT_FOUND).json({ message: "Member not found in this workspace" });

        await createNotification({
            userId: memberIdToUpdate,
            message: `Your role in ${workspace.workspaceName} was updated to ${role}`,
            type: "message",
            repoId: repoId,
            targetType: "repository",
            targetId: repoId
        });

        res.status(StatusCodes.OK).json({ status: "success", data: workspace.members });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

// @desc evicting the member lol
// @route DELETE /api/repos/:repoId/members/:userId
export const removeMember = async (req, res) => {
    try {
        const { repoId, userId: memberIdToRemove } = req.params;

        // Security check: Find repo first to ensure we aren't removing the last owner
        const workspaceCheck = await Repository.findById(repoId);
        if (!workspaceCheck) return res.status(StatusCodes.NOT_FOUND).json({ message: "Workspace not found" });

        const member = workspaceCheck.members.find(m => m.userId.toString() === memberIdToRemove.toString());
        if (member?.role === "owner") {
            const ownerCount = workspaceCheck.members.filter(m => m.role === "owner").length;
            if (ownerCount <= 1) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: "Cannot remove the last owner of a workspace" });
            }
        }

        const updatedWorkspace = await Repository.findByIdAndUpdate(
            repoId,
            { $pull: { members: { userId: memberIdToRemove } } },
            { new: true }
        );

        await createLog(
            req.user._id, 
            repoId,
            "removed member",
            "user", 
            memberIdToRemove,
            "Removed user from workspace"
        );

        res.status(StatusCodes.OK).json({ status: "success", message: "Member removed" , data:updatedWorkspace.members});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};