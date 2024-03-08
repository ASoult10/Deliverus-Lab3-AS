import OrderController from '../controllers/OrderController.js'
import ProductController from '../controllers/ProductController.js'
import RestaurantController from '../controllers/RestaurantController.js'
import { Restaurant } from '../models/models.js'
import { handleFilesUpload } from '../middlewares/FileHandlerMiddleware.js'
import { hasRole, isLoggedIn } from '../middlewares/AuthMiddleware.js'
import { checkEntityExists } from '../middlewares/EntityMiddleware.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'
import * as RestaurantMiddleware from '../middlewares/RestaurantMiddleware.js'
import * as RestaurantValidation from '../controllers/validation/RestaurantValidation.js'

const loadFileRoutes = function (app) {
  app.route('/restaurants')
    .get(
      RestaurantController.index)
    .post(
      isLoggedIn,
      hasRole('owner'),
      handleFilesUpload(['logo', 'heroImage'], process.env.RESTAURANTS_FOLDER),
      RestaurantValidation.create,
      handleValidation,
      RestaurantController.create)

  app.route('/restaurants/:restaurantId')
    .get(
      checkEntityExists(Restaurant, 'restaurantId'),
      RestaurantController.show)
    .put(
      isLoggedIn,
      hasRole('owner'),
      handleFilesUpload(['logo', 'heroImage'], process.env.RESTAURANTS_FOLDER),
      checkEntityExists(Restaurant, 'restaurantId'),
      RestaurantMiddleware.checkRestaurantOwnership,
      RestaurantValidation.update,
      handleValidation,
      RestaurantController.update)
    .delete(
      isLoggedIn,
      hasRole('owner'),
      RestaurantMiddleware.checkRestaurantOwnership,
      checkEntityExists(Restaurant, 'restaurantId'),
      RestaurantMiddleware.restaurantHasNoOrders,
      RestaurantController.destroy)

  app.route('/restaurants/:restaurantId/orders')
    .get(
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(Restaurant, 'restaurantId'),
      RestaurantMiddleware.checkRestaurantOwnership,
      OrderController.indexRestaurant)

  app.route('/restaurants/:restaurantId/products')
    .get(
      checkEntityExists(Restaurant, 'restaurantId'),
      ProductController.indexRestaurant)

  app.route('/restaurants/:restaurantId/analytics')
    .get(
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(Restaurant, 'restaurantId'),
      RestaurantMiddleware.checkRestaurantOwnership,
      OrderController.analytics)
}
export default loadFileRoutes
