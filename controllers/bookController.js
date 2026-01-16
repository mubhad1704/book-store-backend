// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.paymentKey);

const stripe = require("stripe")(process.env.paymentKey);
const books = require("../models/bookModel");

exports.addBook = async (req, res) => {
  console.log("Inside add Book");
  console.log(req.body);

  const {
    title,
    author,
    noofpages,
    imageUrl,
    price,
    dprice,
    abstract,
    publisher,
    language,
    isbn,
    category,
  } = req.body;

  //image file to filename
  console.log(req.files);
  const UploadedImages = [];
  req.files.map((item) => UploadedImages.push(item.filename));
  console.log(UploadedImages);
  const userMail = req.payload;
  console.log(userMail);

  try {
    const existingBook = await books.findOne({ title, userMail });
    if (existingBook) {
      res.status(402).json("Book already exist...");
    } else {
      const newBook = await books({
        title,
        author,
        noofpages,
        imageUrl,
        price,
        dprice,
        abstract,
        publisher,
        language,
        isbn,
        category,
        UploadedImages,
        userMail,
      });
      await newBook.save();
      res.status(200).json("Book added successfully");
    }
  } catch (err) {
    res.status(500).json(err);
  }

  //   res.send("Request Recieved");
};

exports.getAllBooks = async (req, res) => {
  console.log("Inside get allBooks");
  searchKey = req.query.search;
  console.log(req.query.search);
  try {
    const query = searchKey? {
      title: {
        $regex: searchKey,
        $options: "i",
      }
    }:{};

    const existingBooks = await books.find(query);
    res.status(200).json(existingBooks);
  } catch (err) {
    res.status(500).json("Err" + err);
  }
};

exports.getHomeBooks = async (req, res) => {
  console.log("Inside get Home Books");
  try {
    const existingBooks = await books.find().sort({ _id: -1 }).limit(4);
    res.status(200).json(existingBooks);
  } catch (err) {
    res.status(500).json("Err" + err);
  }
};

exports.viewBook = async (req, res) => {
  console.log("Inside View Book");
  console.log(req.params);

  try {
    const { id } = req.params;
    // console.log(id);

    const existingBook = await books.findOne({ _id: id });
    if (existingBook) {
      res.status(200).json(existingBook);
    } else {
      res.status(404).json("Book not found");
    }
  } catch (err) {
    res.status(500).json("Err" + err);
  }
};

exports.buyBook = async (req, res) => {
  console.log("Inside payment");
  const { bookDetails } = req.body;
  email = req.payload.userMail;
  try {
    const existingBooks = await books.findByIdAndUpdate(
      bookDetails._id,
      {
        title: bookDetails.title,
        author: bookDetails.author,
        noofpages: bookDetails.noofpages,
        imageUrl: bookDetails.imageUrl,
        price: bookDetails.price,
        dprice: bookDetails.dprice,
        abstract: bookDetails.abstract,
        publisher: bookDetails.publisher,
        language: bookDetails.language,
        isbn: bookDetails.isbn,
        category: bookDetails.category,
        UploadedImages: bookDetails.UploadedImages,
        status: "sold",
        userMail: bookDetails.userMail,
        brought: email,
      },
      { new: true }
    );
    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: bookDetails.title,
            description: `${bookDetails.author} | ${bookDetails.publisher}`,
            images: [bookDetails.imageUrl],
            metadata: {
              title: bookDetails.title,
              author: bookDetails.author,
              noofpages: bookDetails.noofpages,
              imageUrl: bookDetails.imageUrl,
              price: bookDetails.price,
              dprice: bookDetails.dprice,
              abstract: bookDetails.abstract,
              publisher: bookDetails.publisher,
              language: bookDetails.language,
              isbn: bookDetails.isbn,
              category: bookDetails.category,
              UploadedImages: bookDetails.UploadedImages,
              status: "sold",
              userMail: bookDetails.userMail,
              brought: email,
            },
          },
          unit_amount: Math.round(Number(bookDetails.dprice) * 100),
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      success_url: "https://bookstore-three-kappa.vercel.app/payment-success",
      cancel_url: "https://bookstore-three-kappa.vercel.app/payment-error",
      line_items,
      mode: "payment",
    });
    res.status(200).json({message:"success",session,asessionID:session.id});
  } catch (err) {
    res.status(500).json("Err" + err);
  }
};
