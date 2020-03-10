import {Schema} from 'mongoose';

const authSchema = new Schema({
    username: {type: String, required: true},
    passHash: {type: String, required: true}
});

authSchema.methods.validate = () => {
    return false;
};