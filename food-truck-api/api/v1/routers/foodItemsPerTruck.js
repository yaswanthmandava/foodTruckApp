const express = require('express');
const moment = require('moment');
const response = require('../../../core/response');
const { catchAsync } = require('../../../core/utils/catch-async');
const { validateDate } = require('../../../core/utils')

const ROUTE_URI = 'foodItemsPerTruck';
const foodItemsPerTruckModel = require('../models/foodItemsPerTruck');
const foodItemsModel = require('../models/foodItems');
const foodTruckModel = require('../models/foodTruck');

const router = express.Router();
const logger = require('./../../../core/logger');

const routes = {
    async getAllItemsPerTruck(req, res) {
        logger.info('Calling user route to get all Users');
        if(req.query.truckId && req.query.date && validateDate(req.query.date) ){
            const items = await foodItemsPerTruckModel.findFoodItemsPerTruckByTruckId(req.query.truckId , req.query.date);
            response.success(res, items);
        } else{
            const itemsPerTruck = await foodItemsPerTruckModel.findAll();
            response.success(res, itemsPerTruck);
        }
    },
    async createFoodItemsPerTruck(req, res) {
        logger.info('Create scenario with or without AVUX file');
        const item = req.body;
        const itemInfo = await foodItemsModel.findFoodItemById(item.itemId);
        const truckInfo = await foodTruckModel.findFoodTruckByTruckId(item.truckId);
        if(itemInfo?.length>0 && truckInfo.length>0 && validateDate(item.date) ){
            const entry = {};
            entry.id = 'IT-'+Math.round((new Date()).getTime() / 1000);
            entry.createdDate = new Date();
            entry.truckId = truckInfo[0].truckId;
            entry.name = truckInfo[0].name;
            entry.description = truckInfo[0].description;
            entry.imageUrl = truckInfo[0].imageUrl;
            entry.date = moment(item.date,"YYYY-MM-DD").utcOffset(0, true);
            entry.itemId = itemInfo[0].itemId;
            entry.itemName = itemInfo[0].name;
            entry.itemUrl = itemInfo[0].imageUrl;
            entry.itemDescription = itemInfo[0].description;
            const result = await foodItemsPerTruckModel.createfoodItemsPerTruck(
                entry
            );
            logger.info('scenario created in application with or without AVUX file');
            response.created(res, result);
        } else{
            response.badRequest(res);
        }
        
    },
    async getFoodItemsPerTruckById(req, res) {
        logger.info('Calling user route to get all Users');
        if(validateDate(req.query.date)){
            const itemsPerTruck = await foodItemsPerTruckModel.findFoodItemsPerTruckById(req.params.id, req.query.date);
            response.success(res, itemsPerTruck);
        } else{
            response.badRequest(res);
        }
       
    },
    async deleteFoodItemsPerTruckById(req, res) {
        logger.info('Calling user route to get all Users');
        const itemsPerTruck = await foodItemsPerTruckModel.findAll();
        response.success(res, itemsPerTruck);
    }
};

router.get('', catchAsync(routes.getAllItemsPerTruck));
router.post('', catchAsync(routes.createFoodItemsPerTruck));
router.get('/:id', catchAsync(routes.getFoodItemsPerTruckById));
router.delete('/:id', catchAsync(routes.deleteFoodItemsPerTruckById));

module.exports = {
    uri: ROUTE_URI,
    router,
    routes
};
