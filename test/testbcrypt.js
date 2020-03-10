const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sample_input = crypto.randomBytes(16).toString('hex');

async function timeHash(rounds) {
    const start = new Date().getTime();
    console.log(`Hashing for ${rounds} rounds (${start})`);
    return bcrypt.hash(sample_input, rounds)
        .then(result => {
            return new Date().getTime() - start;
        });
}

console.log(`Sample Hash Input: ${sample_input}`);
const rounds = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

rounds.forEach(rounds => {
    timeHash(rounds)
        .then(time => {
            console.log(`Hashing for ${rounds} rounds took ${time} milliseconds`)
        })
});