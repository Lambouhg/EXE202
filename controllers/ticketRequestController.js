const TicketRequest = require('../models/TicketRequest');
const Ticket = require('../models/Ticket');

// Tạo yêu cầu đổi vé
exports.createTicketRequest = async (req, res) => {
  try {
    const { requestedTicket, offeredTicket } = req.body;
    const userId = req.user.id;

    const ticketRequest = new TicketRequest({
      requester: userId,
      requestedTicket,
      offeredTicket,
      status: 'pending',
    });

    await ticketRequest.save();

    // Cập nhật trạng thái vé
    await Ticket.findByIdAndUpdate(requestedTicket, { status: 'in-exchange' });

    return res.status(201).json({ message: 'Yêu cầu đổi vé đã được tạo!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Duyệt yêu cầu đổi vé
exports.acceptTicketRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const ticketRequest = await TicketRequest.findById(requestId);
    if (!ticketRequest) {
      return res.status(404).json({ message: 'Yêu cầu không tồn tại!' });
    }

    const { requestedTicket, offeredTicket } = ticketRequest;

    ticketRequest.status = 'accepted';
    await ticketRequest.save();

    const requestedTicketObj = await Ticket.findById(requestedTicket);
    const offeredTicketObj = await Ticket.findById(offeredTicket);

    // Chuyển quyền sở hữu vé
    requestedTicketObj.owner = offeredTicketObj.owner;
    offeredTicketObj.owner = ticketRequest.requester;

    await requestedTicketObj.save();
    await offeredTicketObj.save();

    return res.status(200).json({ message: 'Yêu cầu đổi vé đã được chấp nhận!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Từ chối yêu cầu đổi vé
exports.rejectTicketRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const ticketRequest = await TicketRequest.findById(requestId);
    if (!ticketRequest) {
      return res.status(404).json({ message: 'Yêu cầu không tồn tại!' });
    }

    ticketRequest.status = 'rejected';
    await ticketRequest.save();

    // Trả lại trạng thái vé
    await Ticket.findByIdAndUpdate(ticketRequest.requestedTicket, { status: 'booked' });

    return res.status(200).json({ message: 'Yêu cầu đổi vé đã bị từ chối!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};
