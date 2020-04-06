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

});

const Review = mongoose.model('Review', reviewSchema);

export default Review;