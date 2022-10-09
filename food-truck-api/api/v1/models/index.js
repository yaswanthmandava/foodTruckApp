const FoodTruck = require('./foodTruck');
const FoodItems = require('./foodItems');
const FoodItemsPerTruck = require('./foodItemsPerTruck');


// key should be the model name
module.exports = {
    foodTruck: FoodTruck.schema,
    foodItems: FoodItems.schema,
    foodItemsPerTruck: FoodItemsPerTruck.schema
};
