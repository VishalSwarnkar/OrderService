const express = require('express'); 
const router  = express.Router();
const services = require('../../services/orderServices');

router.get('/orders/all', services.getAllOrders);
router.post('/orders', services.placeOrders);
router.get('/orders/:orderId', services.getOrderDetails);
router.delete('/:orderId', services.deleteOrder);
router.put('/:orderId', services.updateOrderDetails);
router.get('/orders/:restId/:city', services.getOrdersDetailsByRestaurantCity)
router.get('/orders', services.getOrdersByCity)
  

module.exports = router;