const bcrypt = require('bcryptjs');
const SALT_ROUNDS = process.env.SALT_ROUNDS || 12;

module.exports = class User {
    constructor() {
        this.id = null;
        this.email = null;
        this.password = null;
    }

    setHashedPassword(password) {
        let salt = bcrypt.genSaltSync(SALT_ROUNDS);
        let hash = bcrypt.hashSync(password, salt);
        this.password = hash;
    }

    verifyPassword(password) {
        if (password == this.password) {
            return true;
        }

        return bcrypt.compareSync(password, this.password);
    }
}