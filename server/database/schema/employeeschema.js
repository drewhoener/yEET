import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

const employeeSchema = new Schema({
    employeeId: { type: Number, required: true, index: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    startDate: { type: Date },
    passwordHash: { type: String, required: true },
    position: { type: String, required: true },
    manager: { type: mongoose.ObjectId, required: false, 'default': null },
    company: { type: mongoose.ObjectId, required: true },
});

employeeSchema.pre('save', function (next) {
    if (this.isModified('passwordHash')) {
        bcrypt.hash(this.passwordHash, SALT_ROUNDS)
            .then(hash => {
                this.passwordHash = hash;
                next();
            })
            .catch(err => next(err));
        return;
    }

    return next();
});

employeeSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.passwordHash);
};

employeeSchema.methods.hasManager = () => {
    return this.manager !== null;
};

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;