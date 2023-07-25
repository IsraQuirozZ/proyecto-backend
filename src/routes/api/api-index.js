import { Router } from 'express';
import cart_router from './carts.mongo.js';

const router = Router();

// router.use('/products', products_router);
router.use('/cart', cart_router);
// router.use('/auth', auth_router)


export default router;
