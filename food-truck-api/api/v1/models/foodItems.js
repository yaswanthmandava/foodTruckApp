/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }]*/
const mongoose = require('mongoose');
const R = require('ramda');
const logger = require('../../../core/logger');
const utils = require('./db.utils');
const constants = require('../../../core/constants');
const { uuidv4 } = require('../../../core/validations');

const foodItemsSchema = new mongoose.Schema({
    itemId: String,
    name: String,
    description: String,
    imageUrl: String,
    createdDate: Date,
    isAvailable: Boolean
}, { toJSON: { virtuals: true }, id: false });
foodItemsSchema.set('versionKey', false);

const model = {
    foodItemsSchema: null
};
mongoose.model('foodItems', foodItemsSchema);
const getFoodItemModel = utils.GetModel('foodItems', foodItemsSchema);

module.exports = {
    schema: foodItemsSchema,
    async createItem(data, conn = null) {
        logger.info('Create item record into FoodTruck');
        const item = { ...data };
        const result = await getFoodItemModel(conn).create(item);
        return R.omit(['_id', '__v'], result.toJSON());
    },
    async insert(models = [], modelName, conn) {
        logger.info('Insert records into FoodTruck');
        const items = models.map((t) => {
            const item = Object.create(t);
            return task;
        });
        return getFoodItemModel(conn).collection.insert(R.clone(items));
    },
    async removeAll(modelName, conn) {
        logger.trace(`Deleting "${model[modelName]}" from DB`);
        return getFoodItemModel(conn);
    },
    async findAll(conn) {
        logger.info('Fetching all the task records from FoodTruck');
        return getFoodItemModel(conn)
            .find({ }, { _id: 0, __v:0  })
            .exec()
            .then(res => res.map(item => item.toJSON()));
    },
    async findFoodItemById(itemId, conn) {
        logger.info('Fetching task record from FoodTruck by Deal id');
        return getFoodItemModel(conn)
            .find({ itemId}, { _id: 0, __v:0 })
            // .populate({ path: 'status', options: { select: { statusId: 1 } } })
            .exec()
            .then(res => res.map(item => item.toJSON()));
    },
    async deleteById(itemId, conn) {
        logger.info('delete scenario by Id');
        const item = await getFoodItemModel(conn).find({ itemId}, { _id: 0, __v:0  });
    
        if (item === null) {
            logger.info(`Scenario does not exist in FoodTruck - ${id}`);
            return constants.DeleteFoodItemStates.INVALID_ID;
        }
        logger.info('Deleting the property assets by id');
        try {
            await  getFoodItemModel(conn).deleteOne({itemId});
            return constants.DeleteFoodItemStates.SUCCESS;
        } catch (err) {
            logger.error('Error deleting scenario from DB:', err.stack);
            return constants.DeleteFoodItemStates.FAIL;
        }
    }
};
