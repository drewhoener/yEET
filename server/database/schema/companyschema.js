import mongoose, {Schema} from 'mongoose';

const companySchema = new Schema({
    companyId: {type: Number, required: true, unique: true, index: true},
    name: {type: String, required: true, index: true},
});

const Company = mongoose.model('Company', companySchema);

export default Company;