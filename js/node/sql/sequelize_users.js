const Sequelize = require('sequelize');
const sequelize = new Sequelize('sqlite://./user.db');

const User = sequelize.define('users', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  birthday: Sequelize.DATE,
});

sequelize.sync()
  .then(() => User.create({
    username: 'hd',
    password: "123",
    birthday: new Date(1999, 6, 20)
  })).then(jane => {
    console.log(jane.get({
      plain: true
    }));
  });