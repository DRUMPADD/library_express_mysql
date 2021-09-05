const conn = require('./db');


// ?? Login and register functions
exports.getUserLoggedIn = (user, pwd) => {
    return new Promise ((res, rej) => {
        conn.query('SELECT * from cuentas where username = ? and password = ?',[user, pwd], (error, rows, fields) => {
            if(error) {
                rej(error);
            }
            res(rows);
        });
    })
}

exports.registerUser = (user, pwd, email) => {
    return new Promise ((res, rej) => {
        conn.query('INSERT INTO cuentas(username, password, email) values (?, ?, ?)', [user, pwd, email], (error, rows, fields) => {
            if(error) {
                rej(error);
            }
            res(rows);
        });
    });
}

// ?? CRUD Book functions
exports.getBooks = () => {
    return new Promise ((res, rej) => { 
        conn.query('SELECT id_libro, libro, c_autor.autor FROM c_libro, c_autor where c_autor.id_autor = c_libro.autor', (error, rows, fields) => {
            if(error) {
                rej(error);
            } else {
                res(rows);
            }
        });
    })
}

exports.insertBook = (bookN, id_author) => {
    return new Promise ((res, rej) => {
        conn.query('INSERT INTO c_libro(libro, autor) values(?, ?)', [bookN, id_author], (error, rows, fields) => {
            if(error) {
                rej(error);
            }
            res(rows);
        });
    });
}

exports.getBook_id = (id_book) => {
    return new Promise ((res, rej) => {
        conn.query('SELECT * FROM c_libro where id_libro = ?', [id_book], (error, rows, fields) => {
            if(error) {
                rej(error);
            }
            res(rows);
        });
    });
}

exports.updateBook = (id_book, bookName, id_author) => {
    return new Promise ((res, rej) => {
        conn.query('UPDATE c_libro SET libro = ?, autor = ? where id_libro = ?', [bookName, id_author, id_book], (error, rows, fields) => {
            if(error) {
                rej(error);
            }
            res(rows);
        });
    });
}

exports.deleteBook = (id_book) => {
    return new Promise ((res, rej) => {
        conn.query('DELETE FROM c_libro where id_libro = ?', [id_book], (error, rows, fields) => {
            if(error) {
                rej(error);
            }
            res(rows);
        });
    });
}

// ?? CRUD Author functions
exports.getAuthors = () => {
    return new Promise ((res, rej) => { 
        conn.query('SELECT * FROM c_autor', (error, rows, fields) => {
            if(error) {
                rej(error);
            } else {
                res(rows);
            }
        });
    })
}

exports.insertAuthor = (author_name, phone_number) => {
    return new Promise ((res, rej) => {
        conn.query('INSERT INTO c_autor(autor, telefono) values(?, ?)', [author_name, phone_number], (error, rows, fields) => {
            if(error) {
                rej(error);
            }
            res(rows);
        });
    });
}

exports.getAuthor_id = (id_author) => {
    return new Promise ((res, rej) => {
        conn.query('SELECT * FROM c_autor where id_autor = ?', [id_author], (error, rows, fields) => {
            if(error) {
                rej(error);
            }
            res(rows);
        });
    });
}

exports.updateAuthor = (id_author, author_name, phone_number) => {
    return new Promise ((res, rej) => {
        conn.query('UPDATE c_autor SET autor = ?, telefono = ? where id_autor = ?', [author_name, phone_number, id_author], (error, rows, fields) => {
            if(error) {
                rej(error);
            }
            res(rows);
        });
    });
}

exports.deleteAuthor = (id_author) => {
    return new Promise ((res, rej) => {
        conn.query('UPDATE c_autor SET activo = 0 where id_autor = ?', [id_author], (error, rows, fields) => {
            if(error) {
                rej(error);
            }
            res(rows);
        });
    });
}
