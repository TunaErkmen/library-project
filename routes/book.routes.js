const express = require('express');
const Book = require('../models/Book.model')
const router = express.Router();

/* GET /books */
router.get("/books", (req, res, next) => {
//res.send ("that seems work");
Book.find()
.then(booksArr => {
  const data = {
    books: booksArr
  };

  res.render ("books/books-list", data)
})
.catch(e => {
  console.log("error getting books from DB", e);
  next(e);
});

});

//GET /books/create
router.get("/books/create", (req, res, next) => {
  res.render("books/book-create")
});

//POST /books
router.post("/books", (req, res, next) => {
const bookDetails = {
  title: req.body.title,
  description: req.body.description,
  author: req.body.author,
  rating: req.body.rating
}

Book.create(bookDetails)
  .then( bookFromDB => {
    res.redirect ("/books");
  })
  .catch(e => {
    console.log("error creating new book", e);
    next(e);
  });
});


router.get('/books/:bookId/edit', (req, res, next) => {
  const { bookId } = req.params;
 
  Book.findById(bookId)
    .then(bookToEdit => {
      // console.log(bookToEdit);
      res.render('books/book-edit.hbs', { book: bookToEdit }); // <-- add this line
    })
    .catch(error => next(error));
});

router.post('/books/:bookId/edit', (req, res, next) => {
  const { bookId } = req.params;
  const { title, description, author, rating } = req.body;
 
  Book.findByIdAndUpdate(bookId, { title, description, author, rating }, { new: true })
    .then(updatedBook => res.redirect(`/books/${updatedBook.id}`)) // go to the details page to see the updates
    .catch(error => next(error));
});


router.get("/books/:bookId", (req,res,next) => {
  Book.findById(req.params.bookId)
  .then((result) => {
    res.render("books/book-details", result);
  
  })
  .catch(e => {
    console.log("error getting books from DB", e);
    next(e);
  })
});

router.post('/books/:bookId/delete', (req, res, next) => {
  const { bookId } = req.params;
 
  Book.findByIdAndDelete(bookId)
    .then(() => res.redirect('/books'))
    .catch(error => next(error));
});


module.exports = router;
