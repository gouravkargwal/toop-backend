const createError = require("http-errors");
const Customer = require("../model/customerModel");

exports.register = async (req, res, next) => {
  try {
    console.log(req.body);
    const { username, email, password } = req.body;

    const doesExist = await Customer.findOne({ email: email });
    if (doesExist) throw createError.Conflict(`${email} already exist!`);

    const customer = new Customer({
      name: username,
      email: email,
      password: password,
    });

    customer.save(function (err, result) {
      if (err && err.code !== 11000) throw createError.InternalServerError();
      if (err && err.code === 11000)
        throw createError.Conflict("User already exists!");
      console.log(result);
      res.status(200).json({
        message: "Registered Successfully. Please signin",
        user: { username: result.name, email: result.email, _id: result._id },
      });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email: email });

    if (!customer) throw createError.NotFound("User not registered");

    const isMatch = await customer.isValidPassword(password);
    if (!isMatch) throw createError.Unauthorized("Username/Password not valid");

    console.log(customer);

    const { _id, name, email: userEmail } = customer;

    res.status(200).json({
      message: "Login Successful",
      user: { _id, email: userEmail, username: name },
    });
  } catch (error) {
    next(error);
  }
};
