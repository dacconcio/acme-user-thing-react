const sequelize = require('sequelize');

const dbURL = process.env.DATABASE_URL || 'postgres://localhost/acme_user';
const db = new sequelize(dbURL);

const User = db.define('user', {
	name: sequelize.TEXT
});

const Thing = db.define('thing', {
	name: sequelize.TEXT
});

const UserThing = db.define('thing', {
	name: sequelize.TEXT
});

//User.belongsToMany(Thing, { through: 'UserThing' });
//Thing.belongsToMany(User, { through: 'UserThing' });

UserThing.belongsTo(User);
UserThing.belongsTo(Thing);
User.hasMany(UserThing);
Thing.hasMany(UserThing);


db.sync({ force: true }).then(async () => {
	const dave = await User.create({ name: 'Dave' });
	const yinglu = await User.create({ name: 'Yinglu' });

	const apple = await UserThing.create({ name: 'Apple' });
	const soap = await UserThing.create({ name: 'Soap' });

	dave.addThing(apple);
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`App listening in port ${PORT}`);
});
