const express = require('express');
const router=express.Router();
const app = express();
const { sendMessages,allMessages } = require('../controllers/messageController')
const {protect} = require('../middleware/authMiddleware')

router.route('/').post(protect, sendMessages);
router.route('/:chatId').get(protect, allMessages)
module.exports = router;