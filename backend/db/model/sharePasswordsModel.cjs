
const sharePasswordsModel = require('../schema/sharePasswords.cjs')

const getAllSharePasswords = async (req, res) => {
    try {
        const sharePasswords = await sharePasswordsModel.find({ creator: req.user.id });

        res.json(sharePasswords);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {getAllSharePasswords};
