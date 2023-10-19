const express=require('express');
const router = express.Router();
const { registerUser,authUser,allUsers } = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware')

router.route("/").post(registerUser);
router.post('/login', authUser);
router.route('/').post(registerUser).get(protect,allUsers);
module.exports = router;
