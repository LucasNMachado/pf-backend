import jwt from 'jsonwebtoken'
import { PRIVATE_KEY } from '../utils/utils.js';

const handlePolicies = policies => async (req, res, next) => {    
    if(policies[0] === 'PUBLIC') return next()

    if(req.headers.authorization){
        const authHeader = req.headers.authorization        
        const token = authHeader.split(' ')[1] 
        let user = jwt.verify(token, PRIVATE_KEY)
        const userRole = user.user.role
        if(!policies.includes(userRole.toUpperCase())) return res.status(403).send({ status: "error", error: "Unauthorized" })
        req.user = user.user;
        next();

    }else if(req.headers.cookie){
        const authHeader = req.headers.cookie 
        const token = authHeader.split('=')[1].slice(0, -13);
        let user = jwt.verify(token, PRIVATE_KEY)
        const userRole = user.user.role        
        if(!policies.includes(userRole.toUpperCase())) return res.status(403).send({ status: "error", error: "Unauthorized" })
        req.user = user.user;
        next();
        
    }else{
        return res.status(401).send({ status: "error", error: "Unauthorized" })
    }  
}
export default handlePolicies

