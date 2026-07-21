const crypto = require('crypto');

const generateTemporaryPassword = () => {

    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "@#$%&*!";

    const all =
        uppercase +
        lowercase +
        numbers +
        symbols;

    let password = "";

    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    const remaining = 8;

    const randomBytes = crypto.randomBytes(remaining);

    for (let i = 0; i < remaining; i++) {
        password += all[randomBytes[i] % all.length];
    }

    return password
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
};

module.exports = generateTemporaryPassword;