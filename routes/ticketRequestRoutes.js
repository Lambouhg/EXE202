const express = require('express');
const router = express.Router();
const ticketRequestController = require('../controllers/ticketRequestController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

// Tạo yêu cầu đổi vé (Cần xác thực người dùng)
router.post('/ticket-requests', authenticate, ticketRequestController.createTicketRequest);

// Duyệt yêu cầu đổi vé (Cần quyền admin)
router.put('/ticket-requests/:id/accept', isAdmin, ticketRequestController.acceptTicketRequest);

// Từ chối yêu cầu đổi vé (Cần quyền admin)
router.put('/ticket-requests/:id/reject', isAdmin, ticketRequestController.rejectTicketRequest);

module.exports = router;
