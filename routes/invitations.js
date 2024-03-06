import express from "express";

import {
  getEventInvitations,
  getMyInvitations,
  getMyFriendRequests,
  createInvitation,
  createFriendRequest,
  updateInvitation,
  deleteInvitation,
} from "../controllers/invitations.js";
import { authenticate } from "../middlewares/authenticate.js";

const invitationRouter = express.Router();

invitationRouter.get("/event/:eventId", authenticate, getEventInvitations);
invitationRouter.get("/user", authenticate, getMyInvitations);
invitationRouter.get("/friendship", authenticate, getMyFriendRequests);
invitationRouter.post("/event/:eventId", authenticate, createInvitation);
invitationRouter.post("/friendship", authenticate, createFriendRequest);
invitationRouter.put("/:invitationId", authenticate, updateInvitation); 
invitationRouter.delete("/:invitationId", authenticate, deleteInvitation); 

export default invitationRouter;
