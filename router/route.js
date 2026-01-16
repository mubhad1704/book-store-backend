const express = require('express')
const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const route = express.Router()
const jwtMiddleware = require('../middleware/jwtMiddleware')
const multerConfig = require('../middleware/multerMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')

route.post('/api/register', userController.userRegister )
route.post('/api/login', userController.userLogin )
route.post('/api/google-login', userController.googleLogin )
route.post('/api/addBook',jwtMiddleware,multerConfig.array('UploadedImages',3),bookController.addBook)
route.get('/api/getAllBooks',jwtMiddleware,bookController.getAllBooks)
route.get('/api/getHomeBooks',bookController.getHomeBooks)
route.get('/api/viewBook/:id',jwtMiddleware,bookController.viewBook)
route.get('/api/get-user',jwtMiddleware,userController.getUser)
route.put('/api/update-user',jwtMiddleware,multerConfig.single('profile'),userController.updateUser)
route.put('/api/makePayment',jwtMiddleware,bookController.buyBook)

// Admin side
route.get('/api/getUsers',adminMiddleware,userController.getUsers)
route.get('/api/getAllAdminBooks',adminMiddleware,bookController.getAllBooks)
route.put('/api/update-admin',adminMiddleware,multerConfig.single('profile'),userController.updateAdmin)
route.get('/api/get-admin',adminMiddleware,userController.getAdmin)

module.exports = route