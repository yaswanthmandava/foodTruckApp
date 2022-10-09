const app = require('express');
const foodItems = require('./foodItems');
const foodTruck = require('./foodTruck');
const foodItemsPerTruck = require('./foodItemsPerTruck');

const router = app.Router();

router.use(`/${foodItems.uri}`, foodItems.router);
router.use(`/${foodTruck.uri}`, foodTruck.router);
router.use(`/${foodItemsPerTruck.uri}`, foodItemsPerTruck.router);

module.exports = {
    routes: router
};
