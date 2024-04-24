module.exports = function(req, res, next) {
    const userID = req.session.userID;
    if (!userID) {
        res.status(401).send('Unauthorized: No session available');
    } else {
        req.user ={id:userID} ;
        next();

    }
}