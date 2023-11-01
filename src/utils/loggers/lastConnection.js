import UsersService from '../../services/usersService.js';

const userService = new UsersService

export const setLastConnection = async (req, res, next) => {
    try {
        const { email } = req.body
        const user = await userService.getUsers(email)
        await userService.setLastConnection(user)
        next();
    } catch (error) {
        console.log({ error })
        res.json({ error }); 
    }
};

export  const setLastDesconnection = async (req, res, next) => {
    try {        
        const user = req.user
        await userService.setLastConnection(user)
        next();
    } catch (error) {
        console.log({ error })
        res.json({ error }); 
    }
};