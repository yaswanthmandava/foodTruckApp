const express = require('express');
const response = require('../../../core/response');
const { catchAsync } = require('../../../core/utils/catch-async');

const ROUTE_URI = 'foodItems';
const foodItemsModel = require('../models/foodItems');

const router = express.Router();
const logger = require('./../../../core/logger');

const constants = require('../../../core/constants');


const routes = {
    async getAllItems(req, res) {
        logger.info('Calling user route to get all Items');
        const items = await foodItemsModel.findAll();
        response.success(res, items);
    },

    async createItem(req, res) {
        logger.info('Create scenario with or without AVUX file');
        const item = req.body;
        item.itemId = 'item-'+ Math.round((new Date()).getTime() / 1000);
        item.createdDate = new Date();
        item.isAvailable - true;
        const result = await foodItemsModel.createItem(
            item
        );
        logger.info('scenario created in application with or without AVUX file');
        response.created(res, result);
    },

    async findItemById(req, res) {
        logger.info('Fetching item by id');
        let scenarioInfo = await foodItemsModel.findFoodItemById(req.params.itemId);
        response.success(res, scenarioInfo);
    },

    async deleteItemsById(req, res) {
        const { itemId } = req.params;
        const result = await foodItemsModel.deleteById(itemId,);
        if (result === constants.DeleteFoodItemStates.SUCCESS) {
            response.success(res, {});
        } else if (result === constants.DeleteFoodItemStates.FAIL) {
            response.serverError(res, new Error(`Delete item with id ${itemId} failed`));
        } else if (result === constants.DeleteFoodItemStates.INVALID_ID) {
            response.notFound(res);
        }
    },

};

router.get('', catchAsync(routes.getAllItems));
router.post('', catchAsync(routes.createItem));
router.get('/:itemId', catchAsync(routes.findItemById));
router.delete('/:itemId', catchAsync(routes.deleteItemsById));

module.exports = {
    uri: ROUTE_URI,
    router,
    routes
};
