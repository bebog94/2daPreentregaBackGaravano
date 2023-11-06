import { Router } from "express";
import { productsManager } from "../dao/managers/productsManager.js";
import { cartsManager } from "../dao/managers/cartsManager.js";

const router = Router();


router.get('/chat', (req, res) => {
    res.render('chat'); 
  });

  router.get('/products', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const sort = req.query.sort || null;
      const query = req.query.query || null;
  
      const products = await productsManager.findAll({
        page,
        limit,
        sort,
        query,
      });
      res.render('products', {products});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  router.get('/products/:id', async (req, res) => {
    const productId = req.params.id;
  
    try {
      const product = await productsManager.findById(productId);
  
      res.render('product-details', { product });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.get('/carts/:id', async (req, res) => {
    const cartId = req.params.id;
  
    try {
      const cart = await cartsManager.findCartById(cartId);
   
      const productsInCart = cart.products; 
  
      res.render('cart-details', { products: productsInCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

export default router;