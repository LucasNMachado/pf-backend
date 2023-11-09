import MyOwnRouter from './router.js';

export default class ViewsRouter extends MyRouter{
    init(){
        this.get('/products', ['ADMIN', 'USER', 'PREMIUM'], privateAccess, getViewProducts);        
        this.get('/carts/:cid', ['ADMIN', 'USER', 'PREMIUM'], privateAccess, getViewCartById);
        this.get('/addProducts', ['ADMIN', 'PREMIUM'], privateAccess, getViewFormularyProducts);
        this.get('/realtimeproducts', ['ADMIN'], privateAccess, getViewHandlebarsProducts)
        this.get('/chat', ['PUBLIC'], getViewChat)
        this.get('/register', ['PUBLIC'], publicAccess, getViewRegisterUser)
        this.get('/login', ['PUBLIC'], publicAccess, getViewLoginUser)
        this.get('/resetPassword/:id', ['PUBLIC'], publicAccess, getViewResetPass)
        this.get('/restartPassword', ['PUBLIC'], publicAccess, getViewRestartPass)
        this.get('/current', ['ADMIN', 'USER', 'PREMIUM'],privateAccess, getViewCurrent )
        this.get('/mockingproducts', ['ADMIN', 'USER', 'PREMIUM'],privateAccess, getViewMocking )
        this.get('/premium/:id', ['ADMIN', 'USER', 'PREMIUM'],privateAccess, getViewPremiumRole)
        this.get('/usersList', ['ADMIN'],privateAccess, getViewUsers)
        this.get('/adminProducts', ['ADMIN'], privateAccess, getViewAdminProducts)
    }

}