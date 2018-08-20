const sequelize = require('sequelize');
const db = new sequelize('postgres://localhost/acme_user');

const User = db.define('user', {
	name: sequelize.TEXT
});

const Thing = db.define('thing', {
	name: sequelize.TEXT
});

User.belongsToMany(Thing, { through: 'UserThing' });
Thing.belongsToMany(User, { through: 'UserThing' });

db.sync({ force: true }).then(async () => {
	const dave = await User.create({ name: 'Dave' });
	const yinglu = await User.create({ name: 'Yinglu' });

	const apple = await Thing.create({ name: 'Apple' });
	const soap = await Thing.create({ name: 'Soap' });

	dave.addThing(apple)

});

const express = require('express');
const app = new express();
const path = require('path');

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res, next) => {
	res.sendFile(path.join(__dirname, '/dist/index.html'));
});

app.get('/users', async (req, res, next) => {
	const allUsersWithThings = await User.findAll({
		include: [{ model: Thing }]
	});

	res.send(allUsersWithThings);
});

app.listen(3000);