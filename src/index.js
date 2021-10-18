const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const models = require('./controllers/models');
const session = require('express-session');
const port = process.env.PORT || 3000;

// Middlewares
app.use(morgan('dev'));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(session({
    secret: 'secret',
    resave: true,
    name: 'uniqueSessionID',
    saveUninitialized: false,
}));

app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('login.html', {
        title: 'Login page'
    });
});

app.post('/auth', async (req, res) => {
    const user = req.body.username;
    const pwd = req.body.password;

    if(user && pwd) {
        const results = await models.getUserLoggedIn(user, pwd);
        if(results) {
            req.session.loggedin = true;
            req.session.user = user;
            res.redirect('/biblioteca');
        } else {
            res.redirect('/');
        }
    }
});

app.get('/register', (req, res) => {
    res.render('register.html', {
        title: 'Register page',
    });
});

app.post('/createUser', async (req, res) => {
    const user = req.body.username;
    const pwd = req.body.password;
    const pwd2 = req.body.password2;
    const email = req.body.email;

    if(user && (pwd == pwd2) && email) {
        await models.registerUser(user, pwd, email);
        res.redirect('/');
    }
    res.end();
});

app.get('/logout', (req, res) => {
    res.clearCookie('user');
    req.session.destroy();
    res.redirect("/");
});

app.get('/biblioteca/', async (req, res) => {
    if(req.session.loggedin) {
        let datos = await models.getBooks();

        res.render('index.html', {
            title: 'Principal',
            datos:  datos
        });

        // console.log(req.session.user);
    } else {
        res.redirect("/");
    }
});


app.get('/biblioteca/books', async (req, res) => {
    if(req.session.loggedin) {
        const books = await models.getBooks();
        const authors = await models.getAuthors();

        res.render('books.html', {
            title: 'Books',
            books: books,
            authors: authors,
        });
    } else {
        res.redirect("/");
    }
});

app.post('/biblioteca/books/saveBook', async (req, res) => {
    if(req.session.loggedin) {
        const book_name = req.body.book_name;
        const select_author = req.body.select_author;

        if(book_name && select_author) {
            const form = await models.insertBook(book_name, select_author);
            if(form) {
                console.log("Book saved");
                res.redirect("/biblioteca");
            }
        } else {
            res.redirect("/biblioteca/books");
        }
    } else {
        res.redirect("/");
    }
});

app.get('/biblioteca/update_book/(:id)', async (req, res) => {
    if(req.session.loggedin) {
        const id_book = req.params.id;
        const book = await models.getBook_id(id_book);
        const authors = await models.getAuthors();

        res.render("up_book.html", {
            title: 'Update book',
            dataBook: book,
            authors: authors,
        });
    } else {
        res.redirect("/");
    }
});

app.post('/biblioteca/update_book/(:id)', async (req, res) => {
    if(req.session.loggedin) {
        const id_book = req.params.id;
        const book_name = req.body.book_name;
        const id_author = req.body.select_author;
        
        if(id_book && book_name && id_author) {
            await models.updateBook(id_book, book_name, id_author);
            res.redirect("/biblioteca");
            console.log("Book updated");
        }
    } else {
        res.redirect("/");
    }
});

app.get('/biblioteca/delete_book/(:id)', async (req, res) => {
    if(req.session.loggedin) {
        const id_book = req.params.id;
    
        if(id_book) {
            await models.deleteBook(id_book);
            res.redirect("/biblioteca");
            console.log("Book updated");
        }
    } else {
        res.redirect("/");
    }
});

app.get('/biblioteca/authors', async (req, res) => {
    if(req.session.loggedin) {
        const authors = await models.getAuthors();

        res.render('authors.html', {
            title: 'Authors',
            authors: authors
        });
    } else {
        res.redirect("/");
    }
});

app.post('/biblioteca/authors/saveAuthor', async (req, res) => {
    if(req.session.loggedin) {
        const author = req.body.author;
        const phone_number = req.body.phone_number;

        if(author && phone_number) {
            await models.insertAuthor(author, phone_number);
            console.log("Book saved");
            res.redirect("/biblioteca/authors");
        }
    } else {
        res.redirect("/");
    }
});

app.get('/biblioteca/update_author/(:id)', async (req, res) => {
    if(req.session.loggedin) {
        const id_author = req.params.id;
        const author = await models.getAuthor_id(id_author);

        res.render("up_author.html", {
            title: 'Update book',
            dataAuthor: author,
        });
    } else {
        res.redirect("/");
    }
});

app.post('/biblioteca/update_author/(:id)', async (req, res) => {
    if(req.session.loggedin) {
        const id_author = req.params.id;
        const author = req.body.author_name;
        const phone = req.body.phone_number;
        
        if(id_author && author && phone) {
            await models.updateAuthor(id_author, author, phone);
            res.redirect("/biblioteca/authors");
            console.log("Book updated");
        }
    } else {
        res.redirect("/");
    }
});

app.get('/biblioteca/delete_author/(:id)', async (req, res) => {
    if(req.session.loggedin) {
        const id_author = req.params.id;
    
        if(id_author) {
            await models.deleteAuthor(id_author);
            res.redirect("/biblioteca/authors");
            console.log("Book updated");
        }
    } else {
        res.redirect("/");
    }
});


app.listen(port, () => {
    console.log('Listening on port', port);
});