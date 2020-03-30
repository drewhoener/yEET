import mongoose, { Schema } from 'mongoose';

export const PendingState = {
    PENDING: 0,
    ACCEPTED: 1,
    REJECTED: 2,
    COMPLETED: 3,
    0: 'Pending',
    1: 'Accepted',
    2: 'Rejected',
    3: 'Completed',
};

const requestSchema = new Schema({

    company: { type: mongoose.ObjectId, required: true, index: true },
    /**
     * The time that the request was issued
     * */
    timeRequested: { type: Date, required: true },
    /**
     * The user that needs a review done for them
     * */
    userRequesting: { type: mongoose.ObjectId, required: true, index: true },
    /**
     * The user receiving the request
     * This is the person that will eventually write the request
     * */
    userReceiving: { type: mongoose.ObjectId, required: true, index: true },

    /**
     * The integer status of the review, able to be looked up in PendingState
     * */
    status: { type: Number, required: true }
});

const Request = mongoose.model('Request', requestSchema);

export default Request;