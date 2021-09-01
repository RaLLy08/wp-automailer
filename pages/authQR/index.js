const Controller = require("./Controller");
const View = require('./View')
const Model = require('./Model')

module.exports = () => new Controller(new Model(), new View());