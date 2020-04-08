import mongoose, { Schema } from 'mongoose';

const reviewSchema = new Schema({
    /**
     * Content is the text in the review
     */
    contents: { type: String, required: true },
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