const express = require('express'); 
const router  = express.Router();
const logger = require('../../logger'); 
// const restaurant_records = require('./getAllRestaurants');

const mongoose = require('mongoose');

const Order = require('../../Models/order');

router.get('/all', (req, res, next)=>{
    Order.find()
    .select('productId quantity _id amount city orderData')
    .exec()
    .then(result=>{
        res.status(200).json({
            counts: result.length,
            order: result.map(order=>{
                return {
                    _id: order.id,
                    productId: order.productId,
                    quantity: order.quantity,
                    amount: order.amount,
                    city: order.city,
                    date: order.orderData,
                    request: {
                        type: 'GET',
                        ur: 'http://localhost:3000/orders/' + order._id
                    }
                }
            })
            
        });
    })
    .catch(err=>{
        logger.error("Error in fetching all the records");
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next)=>{
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        productId: req.body.productId,
        quantity: req.body.quantity,
        amount: req.body.amount,
        city: req.body.city
    })
    order.save().then(result=>{
        res.status(201).json({
            message: "Order Stored",
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity,
                amount: result.amount,
                city: result.city
            },
            request: {
                type: 'GET',
                ur: 'http://localhost:3000/orders/' + result._id
            }
        });
        logger.info("Order Placed successfully", {
            _id: result._id,
            product: result.product,
            quantity: result.quantity,
            amount: result.amount,
            city: result.city
        });
    }).catch(err=>{
        logger.error("Error in placing the order", req.body);
        res.status(500).json({
            error: err.message
        })
    })
    
})

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
    .then((orders)=>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            message: 'Order details',
            orderId: req.params.orderId,
            orders: orders
        });
    })
    .catch((err)=>{
        logger.error(`Error in finding the order id ${req.params.orderId}`);
        res.status(500).json({
            error: err
        })
    });
});

router.delete('/:orderId', (req, res, next) => {
    Order.findByIdAndDelete(req.params.orderId)
    .then((resp)=>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            message: 'Order deleted',
            orderId: req.params.orderId
        });
      }, (err)=>next(err))
      .catch((error)=>{
        logger.error(`Error in deleting the order id ${req.params.orderId}`);
        res.status(500).json({
            error: err
        })
      });
});

router.put('/:orderId', (req, res, next) => {
    Order.findByIdAndUpdate(req.params.orderId, {
        $set: req.body
      }, {new: true} )
      .then((orders)=>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            message: 'Order Updated',
            orderId: req.params.orderId
        });
      }, (err)=>next(err))
      .catch((error)=>{
        logger.error(`Error in updating the order id ${req.params.orderId}`);
        res.status(500).json({
            error: err
        })
      });
});

router.get('/restaurant/:restId/:city', (req, res, next)=>{
    Order.find({
        $and: [
            {productId: req.params.restId}, {city: req.params.city}
        ]
    })
    .then(result=>{
        console.log(result);
        res.status(200).json({
            counts: result.length,
            city: req.params.city,
            amount: result.reduce((acum, data)=>{return acum + data.amount}, 0)
        });
    })
    .catch(err=>{
        logger.error(`Error in total amount of the order for given resturant of the city 
        ${req.params.restId} ${req.params.city}`)
        res.status(500).json({
            error: err
        });
    });
})

router.get('/', (req, res, next)=>{
    console.log(req.query.city)
    Order.find({"city": req.query.city})
    // {"user_rating.aggregate_rating": req.query.rating},
    .then(result=>{
        console.log(result);
        res.status(200).json({
            counts: result.length,
            order: result.map(order=>{
                return {
                    _id: order.id,
                    productId: order.productId,
                    quantity: order.quantity,
                    amount: order.amount,
                    city: order.city,
                    date: order.orderData,
                    request: {
                        type: 'GET',
                        ur: 'http://localhost:3000/orders/' + order._id
                    }
                }
            })
            
        });
    })
    .catch(err=>{
        logger.error(`Error in total amount of the order for given resturant of the city 
        ${req.query.city}`)
        res.status(500).json({
            error: err
        });
    });
})
  

module.exports = router;