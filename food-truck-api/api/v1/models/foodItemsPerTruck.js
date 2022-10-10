/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }]*/
const mongoose = require('mongoose');
const R = require('ramda');
const logger = require('../../../core/logger');
const utils = require('./db.utils');

const foodItemsPerTruckSchema = new mongoose.Schema({
    id: String,
    truckId: String,
    name: String,
    description: String,
    imageUrl: String,
    date:Date,
    itemId: String,
    itemName: String,
    itemUrl: String,
    itemDescription: String,
    createdDate: Date,
    price: Number,
}, { toJSON: { virtuals: true }, id: false });
foodItemsPerTruckSchema.index({ itemId: 1, truckId: 1, date:1});
foodItemsPerTruckSchema.set('versionKey', false);
/* const model = {
    foodItemsPerTruckSchema: null
}; */
mongoose.model('foodItemsPerTruck', foodItemsPerTruckSchema);
const getFoodItemsPerTruckModel = utils.GetModel('foodItemsPerTruck', foodItemsPerTruckSchema);

module.exports = {
    schema: foodItemsPerTruckSchema,
    async createfoodItemsPerTruck(data, conn = null) {
        logger.info('Create item record into FoodTruck');
        const item = { ...data };
        const result = await getFoodItemsPerTruckModel(conn).create(item);
        return R.omit(['_id', '__v'], result.toJSON());
    },
    insert(models = [], modelName, conn) {
        logger.info('Insert records into FoodTruck');
        const items = models.map((t) => {
            const item = Object.create(t);
            return task;
        });
        return getFoodItemsPerTruckModel(conn).collection.insert(R.clone(items));
    },
    removeAll(modelName, conn) {
        logger.trace(`Deleting "${model[modelName]}" from DB`);
        return getFoodItemsPerTruckModel(conn);
    },
    findAll(conn) {
        logger.info('Fetching all the task records from FoodTruck');
        return getFoodItemsPerTruckModel(conn)
            .find({}, { _id: 0, __v:0 })
            .exec()
            .then(res => res.map(item => item.toJSON()));
    },
    findFoodItemsPerTruckById(id, conn){
        logger.info('Fetching all the task records from FoodTruck');
        return getFoodItemsPerTruckModel(conn)
            .find({id}, { _id: 0, __v:0 })
            .exec()
            .then(res => res.map(item => item.toJSON()));
    },
    findFoodItemsPerTruckByTruckId(truckId, date, conn) {
        logger.info('Fetching task record from FoodTruck by Deal id');
        const queryDate = {
            "date":{
                '$gte': `${date}T00:00:00.000Z`,
                '$lt': `${date}T23:59:59.999Z`
            }
        }; 
        return getFoodItemsPerTruckModel(conn)
            .find({ truckId , ...queryDate}, { _id: 0, __v:0,  truckId:0, name: 0, description: 0, imageUrl: 0, date:0 })
            .exec()
            .then(res => res.map(item => item.toJSON()));
    },
};
