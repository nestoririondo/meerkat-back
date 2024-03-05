import express from "express";

import {
  getEventInvitations,
  getMyInvitations,
  createInvitation,
  createFriendRequest,
  updateInvitation,
} from "../controllers/invitations.js";
import { authenticate } from "../middlewares/authenticate.js";

const invitationRouter = express.Router();

invitationRouter.get("/event/:eventId", authenticate, getEventInvitations);
invitationRouter.get("/user", authenticate, getMyInvitations);
invitationRouter.get("/friendship", authenticate, getMyInvitations);
invitationRouter.post("/event/:eventId", authenticate, createInvitation);
invitationRouter.post("/friendship", authenticate, createFriendRequest);
invitationRouter.put("/:invitationId", authenticate, updateInvitation); // accept or decline invitation by invitation id

export default invitationRouter;
