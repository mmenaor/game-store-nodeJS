const { app } = require('./app');

//Models
const { User } = require('./models/user.model');
const { Review } = require('./models/review.model');
const { Game } = require('./models/game.model');
const { Console } = require('./models/console.model');

// import database created in database.util
const { db } = require('./utils/database.util');

db.authenticate()
    .then(() => console.log('Database authenticated'))
    .catch(err => console.log(err));

//Establish model's relations
User.hasMany(Review, {foreignKey: 'userId'});
Review.belongsTo(User);

Game.hasMany(Review, {foreignKey: 'gameId'});
Review.belongsTo(Game);

Game.belongsToMany(Console, { through: 'gameInConsole' });
Console.belongsToMany(Game, { through: 'gameInConsole' });


db.sync()
    .then(() => console.log('Database sync'))
    .catch(err => console.log(err));

// Habilitar la aplicación
app.listen(4000, () => {
    console.log('Express app running!!!');
});