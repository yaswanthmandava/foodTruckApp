/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }]*/
const mongoose = require('mongoose');
const R = require('ramda');
const logger = require('../../../core/logger');
const utils = require('./db.utils');
const constants = require('../../../core/constants');

const foodTruckSchema = new mongoose.Schema({
    truckId: String,
    name: String,
    description: String,
    imageUrl: String,
    createdDate: Date,
    isAvailable: Boolean
}, { toJSON: { virtuals: true }, id: false });
foodTruckSchema.set('versionKey', false);

const model = {
    foodTruckSchema: null
};
mongoose.model('foodTruck', foodTruckSchema);
const getFoodTruckModel = utils.GetModel('foodTruck', foodTruckSchema);

module.exports = {
    schema: foodTruckSchema,
    async createTruck(data, conn = null) {
        logger.info('Create item record into FoodTruck');
        const item = { ...data };
        const result = await getFoodTruckModel(conn).create(item);
        return R.omit(['_id', '__v'], result.toJSON());
    },
    insert(models = [], modelName, conn) {
        logger.info('Insert records into FoodTruck');
        const items = models.map((t) => {
            const item = Object.create(t);
            return task;
        });
        return getFoodTruckModel(conn).collection.insert(R.clone(items));
    },
    removeAll(modelName, conn) {
        logger.trace(`Deleting "${model[modelName]}" from DB`);
        return getFoodTruckModel(conn);
    },
    findAll(conn) {
        logger.info('Fetching all the task records from FoodTruck');
        return getFoodTruckModel(conn)
            .find({ }, { _id: 0, __v:0  })
            .exec()
            .then(res => res.map(item => item.toJSON()));
    },
    findFoodTruckByTruckId(truckId, conn) {
        logger.info('Fetching task record from FoodTruck by Deal id');
        return getFoodTruckModel(conn)
            .find({ truckId }, { _id: 0, __v:0 })
            // .populate({ path: 'status', options: { select: { statusId: 1 } } })
            .exec()
            .then(res => res.map(item => item.toJSON()));
    },
    async deleteById(truckId, conn) {
        logger.info('delete scenario by Id');
        const item = await getFoodTruckModel(conn).find({ truckId}, { _id: 0, __v:0  });
    
        if (item === null) {
            logger.info(`Scenario does not exist in FoodTruck - ${id}`);
            return constants.DeleteTruckStates.INVALID_ID;
        }
        logger.info('Deleting the property assets by id');
        try {
            await  getFoodTruckModel(conn).deleteOne({truckId});
            return constants.DeleteTruckStates.SUCCESS;
        } catch (err) {
            logger.error('Error deleting scenario from DB:', err.stack);
            return constants.DeleteTruckStates.FAIL;
        }
    }
};
