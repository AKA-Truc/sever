const express = require('express');
const usercontroller = require('../controllers/user_controller');
const router = express.Router();

router.post('/addUser',usercontroller.addUserByAdmin);//ok
router.post('/login',usercontroller.login);//ok
router.get('/logout/:uid',usercontroller.logout);//ok
router.get('/getallUser',usercontroller.getAlluser);//ok
router.get('/getUser/:uid',usercontroller.getUsers);//ok
router.delete('/deleteUser/:uid',usercontroller.deleteUser);//ok
router.put('/updateUser/:uid',usercontroller.updateUser);//chay duoc nhung khong bt dungf

module.exports = router;