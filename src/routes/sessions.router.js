import { Router } from 'express'
import MyRouter from './router.js';
import passport from "passport";
import UserController from '../controllers/usersController.js'
import cookieParser from 'cookie-parser';

const router = Router();
router.use(cookieParser());

export default class SessionsRouter extends MyRouter {
  init() {
    this.post('/login', ['PUBLIC'], passport.authenticate('login', {failureRedirect:'/api/sessions/failLogin'}), loginUser)
    this.get('/failLogin', ['PUBLIC'], failLogin)

    this.post('/register', ['PUBLIC'], passport.authenticate('register', {failureRedirect:'/api/sessions/failRegister'}), registerUser)
    this.get('/failRegister', ['PUBLIC'], UserController.failRegister)

    this.put('/resetPassword', ['PUBLIC'], UserController.resetPassword)
    this.put('/restartPassword', ['PUBLIC'], UserController.restartPassword)
    
    this.get('/current', ['USER_ADMIN', 'USER', 'USER_PREMIUM'], UserController.usersCurrent) }}
        






