const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');

console.log(__dirname);
const authKeyPrivate = fs.readFileSync(path.join(__dirname, '../../exempt/ecdsa_secret.pem'));
const authKeyPublic = fs.readFileSync(path.join(__dirname, '../../exempt/ecdsa_secret.pub.pem'));

/**
 * Issues a JWT Token when validating a login request
 * @param employee mongoose Employee schema, should be looked up and not null
 * @return The signed Token
 * */
const issueToken = (employee) => {
    const {_id, employeeId, company} = employee;
    return jwt.sign({
        id: _id.toString(),
        employeeId,
        company: company.toString()
    }, authKeyPrivate, {algorithm: 'ES512', expiresIn: '1h'});
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