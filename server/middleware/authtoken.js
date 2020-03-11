import fs from 'fs';
import jwt from 'jsonwebtoken';

const authKeyPrivate = fs.readFileSync('./../../exempt/ecdsa_secret.pem');
const authKeyPublic = fs.readFileSync('./../../exempt/ecdsa_secret.pub.pem');

/**
 * Issues a JWT Token when validating a login request
 * @param employee mongoose Employee schema, should be looked up and not null
 * @return The signed Token
 * */
const issueToken = (employee) => {
    const {_id, employeeId, company} = employee;
    return jwt.sign({
        _id,
        employeeId,
        company: company.valueOf()
    }, authKeyPrivate, {algorithm: 'ES512'});
};

/**
 * Validates an existing JWT
 * @param token The Token
 * @return A promise for the decrypted token
 * */
const validateToken = async (token) => {
    return jwt.verify(token, authKeyPublic, {algorithm: 'ES512'});
};

export {validateToken, issueToken};