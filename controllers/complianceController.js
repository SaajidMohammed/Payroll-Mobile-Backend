const Compliance = require('../models/Compliance'); // Ensure plural 'models'

/**
 * @desc    Get upcoming tax tasks for the dashboard
 * @route   GET /api/compliance/tasks
 */
exports.getTaxTasks = async (req, res) => {
  try {
    // Requirements: Show PF Filing, ESI Payment, and TDS Filing dues [cite: 33, 36, 39]
    const tasks = await Compliance.find({ status: 'Due' }).sort({ dueDate: 1 });
    
    res.status(200).json({ 
      success: true, 
      count: tasks.length, 
      data: tasks 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Server Error: Unable to fetch compliance tasks' 
    });
  }
};