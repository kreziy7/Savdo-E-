const reportService = require('../services/report.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const getSummary = asyncHandler(async (req, res) => {
  const data = await reportService.getSummary(req.user._id);
  res.status(200).json(new ApiResponse(200, data, 'Summary retrieved'));
});

const getDailyReport = asyncHandler(async (req, res) => {
  const date = req.query.date || new Date().toISOString().slice(0, 10);
  const data = await reportService.getDailyReport(req.user._id, date);
  res.status(200).json(new ApiResponse(200, data, 'Daily report retrieved'));
});

const getMonthlyReport = asyncHandler(async (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7);
  const data = await reportService.getMonthlyReport(req.user._id, month);
  res.status(200).json(new ApiResponse(200, data, 'Monthly report retrieved'));
});

module.exports = { getSummary, getDailyReport, getMonthlyReport };
