const { Router } = require("express");
const { bankModel } = require("../model/Account.model");
const bankRouter = Router();

bankRouter.get("/", async (req, res) => {
  try {
    const existUser = await bankModel.find();
    res.send({ data: existUser });
  } catch (error) {
    res.send({ msg: error });
  }
});

bankRouter.get("/userDetail/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await bankModel.find({ _id: id });
    res.send({ data: data });
  } catch (error) {
    res.send({ msg: error });
  }
});

bankRouter.post("/createAccount", async (req, res) => {
  let {
    name,
    gender,
    dob,
    email,
    mobile,
    initialBalance,
    aadhar,
    pan,
    amount,
  } = req.body;

  amount = initialBalance;
  const existUser = await bankModel.find({
    $or: [{ email: email }, { pan: pan }],
  });

  try {
    if (existUser.length > 0) {
      if (pan != existUser[0].pan || email != existUser[0].email) {
        res.send({ msg: "user with same email or pan exist" });
      } else {
        res.send({ msg: "user exist", id: existUser[0]._id });
      }
    } else {
      let data = new bankModel({
        name,
        gender,
        dob,
        email,
        mobile,
        initialBalance,
        aadhar,
        pan,
        amount,
      });
      await data.save();
      res.send({ msg: "account created successfully", id: data._id });
    }
  } catch (error) {
    res.send({ error: error });
  }
});

bankRouter.patch("/updateKYC/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await bankModel.findByIdAndUpdate({ _id: id }, req.body);
    res.send({ msg: "details updated" });
  } catch (error) {
    res.send({ msg: error });
  }
});

bankRouter.patch("/depositMoney/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await bankModel.find({ _id: id });
    await bankModel.findByIdAndUpdate(
      { _id: id },
      { amount: data[0].amount + req.body.amount }
    );
    res.send({ msg: "money deposit" });
  } catch (error) {
    res.send({ msg: error });
  }
});

bankRouter.patch("/withdrawMoney/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await bankModel.find({ _id: id });
    await bankModel.findByIdAndUpdate(
      { _id: id },
      { amount: data[0].amount - req.body.amount }
    );
    res.send({ msg: "money widthraw" });
  } catch (error) {
    res.send({ msg: error });
  }
});

bankRouter.patch("/transferMoney/:id", async (req, res) => {
  const { id } = req.params;
  const { email, pan, amount } = req.body;
  try {
    const sender = await bankModel.find({ _id: id });
    const receiver = await bankModel.find({ email: email, pan: pan });

    if (sender[0].amount > amount) {
      if (receiver.length > 0) {
        await bankModel.findByIdAndUpdate(
          { _id: id },
          { amount: sender[0].amount - amount }
        );
        await bankModel.findByIdAndUpdate(
          { _id: receiver[0]._id },
          { amount: receiver[0].amount + amount }
        );
        res.send({ msg: "money sent" });
      } else {
        res.send({ msg: "data not found" });
      }
    } else {
      res.send({ msg: "Insufficient balance" });
    }
  } catch (error) {
    res.send({ msg: error });
  }
});

bankRouter.delete("/closeAccount/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await bankModel.findByIdAndDelete({ _id: id });
    res.send({ msg: "account closed" });
  } catch (error) {
    res.send({ msg: error });
  }
});
module.exports = { bankRouter };
