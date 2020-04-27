const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} =require('@handlebars/allow-prototype-access');
const homeRoutes = require('./routes/home');
const cardRoutes = require('./routes/card');
const addRoutes = require('./routes/add');
const ordersRoutes =require('./routes/orders');
const coursesRoutes = require('./routes/courses');
const User = require('./models/user');

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(handlebars)
});
app.engine('hbs',hbs.engine,{});
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use( async (req, res, next) => {
    try {
        const user = await User.findById('5ea28609c53c330d5841ca52');
        req.user = user;
        next();
    } catch (e) {
        console.log(e);
    }
});

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended: true}));
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card',cardRoutes);
app.use('/orders', ordersRoutes);

const PORT = process.env.PORT||3000;

async function start() {
    try {
        const url = 'mongodb+srv://nick:RiucoB9iZXh5VX0r@cluster0-8oit1.mongodb.net/shop';
        await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
        const candidate = await User.findOne();
        if (!candidate){
            const user = new User({
                email: 'zagis-net@mail.ru',
                name: 'nick',
                cart: {items: []}
            });
            await user.save();
        }
        app.listen(PORT, () =>{
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();

