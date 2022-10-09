const express = require('express');
const response = require('../../../core/response');
const { catchAsync } = require('../../../core/utils/catch-async');

const ROUTE_URI = 'foodTrucks';
const foodTruckModel = require('../models/foodTruck');

const router = express.Router();
const logger = require('./../../../core/logger');

const constants = require('../../../core/constants');


const routes = {
    async getAllTrucks(req, res) {
        logger.info('Calling user route to get all Items');
        const items = await foodTruckModel.findAll();
        response.success(res, items);
    },

    async createTruck(req, res) {
        logger.info('Create scenario with or without AVUX file');
        const item = req.body;
        item.truckId = 'truck-'+Math.round((new Date()).getTime() / 1000);
        item.createdDate = new Date();
        item.isAvailable - true;
        const result = await foodTruckModel.createTruck(
            item
        );
        logger.info('scenario created in application with or without AVUX file');
        response.created(res, result);
    },

    async findTruckById(req, res) {
        logger.info('Fetching item by id');
        let scenarioInfo = await foodTruckModel.findFoodTruckByTruckId(req.params.truckId);
        response.success(res, scenarioInfo);
    },

    async deleteTruckById(req, res) {
        const { truckId } = req.params;
        const result = await foodTruckModel.deleteById(truckId,);
        if (result === constants.DeleteTruckStates.SUCCESS) {
            response.success(res, {});
        } else if (result === constants.DeleteTruckStates.FAIL) {
            response.serverError(res, new Error(`Delete truck with id ${truckId} failed`));
        } else if (result === constants.DeleteTruckStates.INVALID_ID) {
            response.notFound(res);
        }
    },

};

router.get('', catchAsync(routes.getAllTrucks));
router.post('', catchAsync(routes.createTruck));
router.get('/:truckId', catchAsync(routes.findTruckById));
router.delete('/:truckId', catchAsync(routes.deleteTruckById));

module.exports = {
    uri: ROUTE_URI,
    router,
    routes
};
