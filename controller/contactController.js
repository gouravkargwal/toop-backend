const createError = require("http-errors");
const Customer = require("../model/customerModel");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await Customer.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "name",
      "_id",
    ]);
    return res.json(users);
  } catch (error) {
    next(error);
  }
};
