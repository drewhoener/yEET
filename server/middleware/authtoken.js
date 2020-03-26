import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';

const authKeyPrivate = fs.readFileSync(path.join(__dirname, '../../exempt/ecdsa_secret.pem'));
const authKeyPublic = fs.readFileSync(path.join(__dirname, '../../exempt/ecdsa_secret.pub.pem'));
const expiresIn = '6h';

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
    }, authKeyPrivate, {algorithm: 'ES512', expiresIn});
};

const reIssueToken = ({id, employeeId, company}) => {
    return jwt.sign({
        id,
        employeeId,
        company
    }, authKeyPrivate, {algorithm: 'ES512', expiresIn});
};

/**
 * Validates an existing JWT
 * @param token The Token
 * @return A promise for the decrypted token
 * */
const validateToken = async (token) => {
    return jwt.verify(token, authKeyPublic, {algorithm: 'ES512'});
};

/**
 * Needs to be on requests that access protected resources
 * */
const authMiddleware = (req, res, next) => {
    const token = req.cookies['auth0'];
    if (!token) {
        res.status(401).send('Unauthorized: Invalid or missing Token');
        return;
    }
    validateToken(token)
        .then(decoded => {
            if (!decoded) {
                res.status(500).send('Internal Server Error');
                return;
            }
            req.tokenData = Object.assign({}, decoded);
            res.cookie('auth0', reIssueToken(token), {httpOnly: true});
            next();
        })
        .catch(err => {
            console.log(`Token Validation Rejected: ${err.name}`);
            res.status(401).send('Unauthorized: Invalid Token');
        });
};

export {validateToken, issueToken, authMiddleware};