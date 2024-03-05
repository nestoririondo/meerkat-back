import express from 'express';

import { getEventInvitations, getFriendRequests, createInvitation, createFriendRequest, updateInvitation } from '../controllers/invitations.js';
import { authenticate } from '../middlewares/authenticate.js';

const invitationRouter = express.Router();

invitationRouter.get('/event/:eventId', authenticate, getEventInvitations); // get invitations by event id
invitationRouter.get('/friendship', authenticate, getFriendRequests);
invitationRouter.post('/event', authenticate, createInvitation);
invitationRouter.post('/friendship', authenticate, createFriendRequest);
invitationRouter.put('/:invitationId', authenticate, updateInvitation); // accept or decline invitation by invitation id

export default invitationRouter;
