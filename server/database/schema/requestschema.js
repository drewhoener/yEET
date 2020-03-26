import mongoose, {Schema} from 'mongoose';

const requestSchema = new Schema({
    /**
     * The time that the request was issued
     * */
    timeRequested: {type: Date, required: true},
    /**
     * The user that needs a review done for them
     * */
    userRequesting: {type: mongoose.ObjectId, required: true, index: true},
    /**
     * The user receiving the request
     * This is the person that will eventually write the request
     * */
    userReceiving: {type: mongoose.ObjectId, required: true, index: true}
});

const Request = mongoose.model('Request', requestSchema);

export default Request;