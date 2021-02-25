const db = require("../models");

// Defining methods for the userController
module.exports = {
  findAll: function (req, res) {
    db.User.find(req.query)
      .sort({ date: -1 })
      .then((dbUser) => res.json(dbUser))
      .catch((err) => res.status(422).json(err));
  },
  findById: function (req, res) {
    db.User.findById(req.params.id)
      .then((dbUser) => res.json(dbUser))
      .catch((err) => res.status(422).json(err));
  },
  create: function (req, res) {
    db.User.create({ ...req.body, email: req.body.email.toLowerCase() })
      .then((dbUser) => res.json(dbUser))
      .catch((err) => res.status(422).json(err));
  },
  update: function (req, res) {
    db.User.findOneAndUpdate({ _id: req.params.id }, { ...req.body, email: req.body.email.toLowerCase() }, {
      new: true,
    })
      .then((dbUser) => res.json(dbUser))
      .catch((err) => res.status(422).json(err));
  },
  remove: function (req, res) {
    db.User.findById({ _id: req.params.id })
      .then((dbUser) => dbUser.remove())
      .then((dbUser) => res.json(dbUser))
      .catch((err) => res.status(422).json(err));
  },
};
