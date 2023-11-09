import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../config/config.js';
import path from 'path';



export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validatePassword = (user, password) => bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PRIVATE_KEY = "CoderKeyFeliz";

export const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '1d' });
    return token;
}

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send({ status: "error", error: "Unauthorized" })
    console.log(authHeader);
    const token = authHeader.split(' ')[1];
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        console.log(error);
        if (error) return res.status(401).send({ status: "error", error: "Unauthorized" })
        req.user = credentials.user;
        next();
    })
}
export const uploader = (folderName) => {
    return multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, `${__dirname}/public/uploads/${folderName}`);
            },
            filename: function (req, file, cb) {
                console.log("Archivo subido correctamente: ", file);
                cb(null, file.originalname);
            },
        }),
        onError: function (err, next) {
            console.log("Error al subir el archivo: ", err);
            next();
        },
    })
}


export default __dirname;


