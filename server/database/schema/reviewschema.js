import mongoose, { Schema } from 'mongoose';

const reviewSchema = new Schema({
    /**
     * Editor contents as a stringified JSON Object
     */
    contents: { type: String, required: true },
    /**
     * The serialized data from the editor contents as raw HTML
     * */
    serializedData: { type: String, default: '<div/>' },
    /**
     * Date of when the review is published
     */
    dateWritten: { type: Date, required: true },
    /**
     * ID number for the specific request
     */
    requestID: { type: mongoose.ObjectId, required: true, index: true },
    /**
     * Status on the completetion of the review
     */
    completed: { type: Boolean, default: false, index: true }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;