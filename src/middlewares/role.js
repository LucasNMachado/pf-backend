
const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "admin") {
        next(); 
    } else {
        res.status(403).send({ status: "error", error: "Access forbidden" });
    }
};

const isUser = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "user") {
        next(); 
    } else {
        res.status(403).send({ status: "error", error: "Access forbidden" });
    }
};

export { isAdmin, isUser };