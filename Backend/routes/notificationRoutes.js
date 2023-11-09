const express = require('express');
const router=express.Router();
const app = express();
const { getNotifications, removeNotifications } = require('../controllers/notificationController');
const {protect} = require('../middleware/authMiddleware')

router.route('/:chatId').get(protect, getNotifications);
router.route('/notifremove').post(protect,removeNotifications)

module.exports = router;