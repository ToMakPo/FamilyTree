const bcrypt = require('bcrypt')

module.exports = {
    /**
     * Hash a password passed in by the user.
     * @param {String} password 
     * @returns {String} the hashed password.
     */
    hash: password => bcrypt.hashSync(password, 12), 
    /**
     * Checks that a password, when hashed, matches the hashed passed in.
     * @param {String} password 
     * @param {String} hashed 
     * @returns {Boolean} true if the password is correct.
     */
    verify: (password, hashed) => bcrypt.compareSync(password, hashed)
}