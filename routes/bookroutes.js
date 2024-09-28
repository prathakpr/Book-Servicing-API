const express = require('express');
const booksRouter = express.Router();

const books = ['one book', 'two book', 'three book'];

booksRouter.get('/', async (req, res, next)=>{
        res.status(200).send(books);
})

module.exports = booksRouter;