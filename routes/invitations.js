import express from "express";

import {
  getEventInvitations,
  getMyEventInvitations,
  getFriendRequests,
  createInvitation,
  createFriendRequest,
  updateInvitation,
} from "../controllers/invitations.js";
import { authenticate } from "../middlewares/authenticate.js";

const invitationRouter = express.Router();

invitationRouter.get("/event/:eventId", authenticate, getEventInvitations);
invitationRouter.get('user', authenticate, getMyEventInvitations);
invitationRouter.get("/friendship", authenticate, getFriendRequests);
invitationRouter.post("/event/:eventId", authenticate, createInvitation);
invitationRouter.post("/friendship", authenticate, createFriendRequest);
invitationRouter.put("/:invitationId", authenticate, updateInvitation); // accept or decline invitation by invitation id

export default invitationRouter;

