import mongoose from "mongoose";
import Books from "../Models/Book.js";

// Correct MongoDB URI: Ensure the database name is valid
const URI = "mongodb+srv://shashank0078:shashank123@cluster0.3dowa.mongodb.net/SEM_6?retryWrites=true&w=majority&appName=Cluster0";

// Sample book data
const BookData = [
    {
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "publisher": "Scribner",
      "publicationDate": "1925-04-10T00:00:00Z",
      "genre": "Fiction",
      "price": 799.00,
      "imageUrl": "https://example.com/images/great-gatsby.jpg",
      "description": "A novel about the American Dream, wealth, and the social upheavals of the 1920s.",
      "year": 1925,
      "availableFormats": ["Paperback", "E-book", "Audiobook"]
    },
    {
      "title": "To Kill a Mockingbird",
      "author": "Harper Lee",
      "publisher": "J.B. Lippincott & Co",
      "publicationDate": "1960-07-11T00:00:00Z",
      "genre": "Fiction",
      "price": 599.00,
      "imageUrl": "https://example.com/images/to-kill-a-mockingbird.jpg",
      "description": "A story of racial injustice and childhood innocence set in the American South.",
      "year": 1960,
      "availableFormats": ["Paperback", "E-book"]
    },
    {
      "title": "1984",
      "author": "George Orwell",
      "publisher": "Secker & Warburg",
      "publicationDate": "1949-06-08T00:00:00Z",
      "genre": "Dystopian",
      "price": 699.00,
      "imageUrl": "https://example.com/images/1984.jpg",
      "description": "A dystopian novel that explores themes of totalitarianism, surveillance, and oppression.",
      "year": 1949,
      "availableFormats": ["Paperback", "Audiobook"]
    },
    {
      "title": "Pride and Prejudice",
      "author": "Jane Austen",
      "publisher": "T. Egerton",
      "publicationDate": "1813-01-28T00:00:00Z",
      "genre": "Romance",
      "price": 499.00,
      "imageUrl": "https://example.com/images/pride-and-prejudice.jpg",
      "description": "A classic romantic novel set in early 19th century England, exploring love and social status.",
      "year": 1813,
      "availableFormats": ["Hardcover", "E-book"]
    },
    {
      "title": "The Catcher in the Rye",
      "author": "J.D. Salinger",
      "publisher": "Little, Brown and Company",
      "publicationDate": "1951-07-16T00:00:00Z",
      "genre": "Fiction",
      "price": 749.00,
      "imageUrl": "https://example.com/images/catcher-in-the-rye.jpg",
      "description": "A novel about a teenager's struggles with alienation, identity, and mental health.",
      "year": 1951,
      "availableFormats": ["Paperback", "Audiobook"]
    },
    {
      "title": "Moby Dick",
      "author": "Herman Melville",
      "publisher": "Harper & Brothers",
      "publicationDate": "1851-10-18T00:00:00Z",
      "genre": "Adventure",
      "price": 899.00,
      "imageUrl": "https://example.com/images/moby-dick.jpg",
      "description": "A sailor's obsession with hunting the great white whale that maimed him.",
      "year": 1851,
      "availableFormats": ["Hardcover", "E-book"]
    },
    {
      "title": "The Odyssey",
      "author": "Homer",
      "publisher": "Various",
      "publicationDate": "0800-01-01T00:00:00Z", // Corrected to a valid date
      "genre": "Epic Poetry",
      "price": 549.00,
      "imageUrl": "https://example.com/images/odyssey.jpg",
      "description": "The epic journey of Odysseus as he returns home from the Trojan War.",
      "year": -800,
      "availableFormats": ["Paperback", "E-book"]
    },
    {
      "title": "The Hobbit",
      "author": "J.R.R. Tolkien",
      "publisher": "George Allen & Unwin",
      "publicationDate": "1937-09-21T00:00:00Z",
      "genre": "Fantasy",
      "price": 799.00,
      "imageUrl": "https://example.com/images/the-hobbit.jpg",
      "description": "The story of Bilbo Baggins, a hobbit who embarks on an adventurous quest.",
      "year": 1937,
      "availableFormats": ["Paperback", "Hardcover", "E-book"]
    },
    {
      "title": "Brave New World",
      "author": "Aldous Huxley",
      "publisher": "Chatto & Windus",
      "publicationDate": "1932-08-01T00:00:00Z",
      "genre": "Dystopian",
      "price": 849.00,
      "imageUrl": "https://example.com/images/brave-new-world.jpg",
      "description": "A dystopian novel that explores a future society controlled by technology and consumerism.",
      "year": 1932,
      "availableFormats": ["Paperback", "Audiobook"]
    },
    {
      "title": "War and Peace",
      "author": "Leo Tolstoy",
      "publisher": "The Russian Messenger",
      "publicationDate": "1869-01-01T00:00:00Z",
      "genre": "Historical Fiction",
      "price": 1299.00,
      "imageUrl": "https://example.com/images/war-and-peace.jpg",
      "description": "A sweeping historical novel that examines Russian society during the Napoleonic wars.",
      "year": 1869,
      "availableFormats": ["Hardcover", "Paperback"]
    },
      {
          "title": "The Alchemist",
          "author": "Paulo Coelho",
          "publisher": "HarperCollins",
          "publicationDate": "1988-05-01T00:00:00Z",
          "genre": "Fiction",
          "price": 499.00,
          "imageUrl": "https://gyaanstore.com/cdn/shop/files/79_d65ac26c-c257-4756-9b57-41b7d00dacd4.png?v=1701858054&width=1920",
          "description": "A novel about the journey of self-discovery and following one's dreams.",
          "year": 1988,
          "availableFormats": ["Paperback", "E-book", "Audiobook"]
      },
      {
          "title": "Little Women",
          "author": "Louisa May Alcott",
          "publisher": "Roberts Brothers",
          "publicationDate": "1868-09-30T00:00:00Z",
          "genre": "Classic",
          "price": 599.00,
          "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUKb_UopgKPCfTeiGqdOkYdaiOiMV1HCQ1HQ&s",
          "description": "The story of four sisters navigating love, loss, and personal growth.",
          "year": 1868,
          "availableFormats": ["Paperback", "E-book"]
      },
      {
          "title": "The Kite Runner",
          "author": "Khaled Hosseini",
          "publisher": "Riverhead Books",
          "publicationDate": "2003-05-29T00:00:00Z",
          "genre": "Fiction",
          "price": 699.00,
          "imageUrl": "https://m.media-amazon.com/images/I/61UgZKkbx+L._AC_UF1000,1000_QL80_.jpg",
          "description": "A heart-wrenching story of friendship and betrayal in Afghanistan.",
          "year": 2003,
          "availableFormats": ["Paperback", "E-book", "Audiobook"]
      },
      {
          "title": "A Tale of Two Cities",
          "author": "Charles Dickens",
          "publisher": "Chapman & Hall",
          "publicationDate": "1859-04-30T00:00:00Z",
          "genre": "Historical Fiction",
          "price": 799.00,
          "imageUrl": "https://m.media-amazon.com/images/I/71CQFGiPA+L._AC_UF1000,1000_QL80_.jpg",
          "description": "A gripping story set during the French Revolution.",
          "year": 1859,
          "availableFormats": ["Hardcover", "E-book"]
      },
      {
          "title": "Jane Eyre",
          "author": "Charlotte Brontë",
          "publisher": "Smith, Elder & Co.",
          "publicationDate": "1847-10-16T00:00:00Z",
          "genre": "Romance",
          "price": 549.00,
          "imageUrl": "https://m.media-amazon.com/images/I/51Xtvezf6ML._AC_UF1000,1000_QL80_.jpg",
          "description": "A novel about love, independence, and resilience.",
          "year": 1847,
          "availableFormats": ["Paperback", "E-book", "Audiobook"]
      },
      {
          "title": "Animal Farm",
          "author": "George Orwell",
          "publisher": "Secker & Warburg",
          "publicationDate": "1945-08-17T00:00:00Z",
          "genre": "Satire",
          "price": 399.00,
          "imageUrl": "https://m.media-amazon.com/images/I/71JUJ6pGoIL.jpg",
          "description": "A satirical allegory about power and corruption.",
          "year": 1945,
          "availableFormats": ["Paperback", "E-book"]
      },
      {
          "title": "The Book Thief",
          "author": "Markus Zusak",
          "publisher": "Knopf Books",
          "publicationDate": "2005-03-14T00:00:00Z",
          "genre": "Historical Fiction",
          "price": 749.00,
          "imageUrl": "https://m.media-amazon.com/images/I/91JGwQlnu7L.jpg",
          "description": "A touching story narrated by Death, set during WWII.",
          "year": 2005,
          "availableFormats": ["Paperback", "E-book", "Audiobook"]
      },
      {
          "title": "Wuthering Heights",
          "author": "Emily Brontë",
          "publisher": "Thomas Cautley Newby",
          "publicationDate": "1847-12-17T00:00:00Z",
          "genre": "Gothic Fiction",
          "price": 599.00,
          "imageUrl": "https://m.media-amazon.com/images/I/81-jFO1dm8L._UF1000,1000_QL80_.jpg",
          "description": "A dark and passionate tale of love and revenge.",
          "year": 1847,
          "availableFormats": ["Hardcover", "E-book"]
      },
      {
          "title": "Crime and Punishment",
          "author": "Fyodor Dostoevsky",
          "publisher": "The Russian Messenger",
          "publicationDate": "1866-01-01T00:00:00Z",
          "genre": "Psychological Fiction",
          "price": 899.00,
          "imageUrl": "https://m.media-amazon.com/images/I/71O2XIytdqL._AC_UF1000,1000_QL80_.jpg",
          "description": "A compelling exploration of morality, guilt, and redemption.",
          "year": 1866,
          "availableFormats": ["Paperback", "E-book"]
      },
      {
          "title": "Frankenstein",
          "author": "Mary Shelley",
          "publisher": "Lackington, Hughes, Harding, Mavor & Jones",
          "publicationDate": "1818-01-01T00:00:00Z",
          "genre": "Horror",
          "price": 499.00,
          "imageUrl": "https://m.media-amazon.com/images/I/81FzMSO3XnL._UF1000,1000_QL80_.jpg",
          "description": "The story of a scientist who creates life with unintended consequences.",
          "year": 1818,
          "availableFormats": ["Paperback", "E-book"]
      },
      {
          "title": "The Lord of the Rings",
          "author": "J.R.R. Tolkien",
          "publisher": "George Allen & Unwin",
          "publicationDate": "1954-07-29T00:00:00Z",
          "genre": "Fantasy",
          "price": 1999.00,
          "imageUrl": "https://m.media-amazon.com/images/I/81j4C6j3dRL.jpg",
          "description": "An epic tale of the battle between good and evil in Middle-earth.",
          "year": 1954,
          "availableFormats": ["Paperback", "Hardcover"]
      },
      {
          "title": "The Shining",
          "author": "Stephen King",
          "publisher": "Doubleday",
          "publicationDate": "1977-01-28T00:00:00Z",
          "genre": "Horror",
          "price": 899.00,
          "imageUrl": "https://m.media-amazon.com/images/I/91U7HNa2NQL._AC_UF1000,1000_QL80_.jpg",
          "description": "A spine-chilling tale of isolation, madness, and a haunted hotel.",
          "year": 1977,
          "availableFormats": ["Paperback", "E-book", "Audiobook"]
      },
      {
          "title": "The Hunger Games",
          "author": "Suzanne Collins",
          "publisher": "Scholastic Press",
          "publicationDate": "2008-09-14T00:00:00Z",
          "genre": "Science Fiction",
          "price": 699.00,
          "imageUrl": "https://m.media-amazon.com/images/I/61I24wOsn8L._AC_UF1000,1000_QL80_.jpg",
          "description": "A dystopian story of survival and rebellion.",
          "year": 2008,
          "availableFormats": ["Paperback", "E-book"]
      },
      {
          "title": "The Road",
          "author": "Cormac McCarthy",
          "publisher": "Knopf",
          "publicationDate": "2006-09-26T00:00:00Z",
          "genre": "Post-Apocalyptic Fiction",
          "price": 599.00,
          "imageUrl": "https://m.media-amazon.com/images/I/81P45LkcMuL._AC_UF1000,1000_QL80_.jpg",
          "description": "A father and son's journey through a desolate post-apocalyptic landscape.",
          "year": 2006,
          "availableFormats": ["Paperback", "Audiobook"]
      },
      {
          "title": "The Giver",
          "author": "Lois Lowry",
          "publisher": "Houghton Mifflin",
          "publicationDate": "1993-04-26T00:00:00Z",
          "genre": "Young Adult",
          "price": 499.00,
          "imageUrl": "https://m.media-amazon.com/images/I/71cJ7+UHpUL._AC_UF1000,1000_QL80_.jpg",
          "description": "A story about a dystopian society that values conformity over individuality.",
          "year": 1993,
          "availableFormats": ["Paperback", "E-book", "Audiobook"]
      },
      {
          "title": "Dracula",
          "author": "Bram Stoker",
          "publisher": "Archibald Constable and Company",
          "publicationDate": "1897-05-26T00:00:00Z",
          "genre": "Gothic Horror",
          "price": 549.00,
          "imageUrl": "https://m.media-amazon.com/images/I/71xcDXkr1OL._AC_UF1000,1000_QL80_.jpg",
          "description": "A chilling tale of the infamous vampire Count Dracula.",
          "year": 1897,
          "availableFormats": ["Hardcover", "E-book"]
      },
      {
          "title": "The Secret Garden",
          "author": "Frances Hodgson Burnett",
          "publisher": "Frederick A. Stokes",
          "publicationDate": "1911-08-01T00:00:00Z",
          "genre": "Children's Literature",
          "price": 399.00,
          "imageUrl": "https://m.media-amazon.com/images/I/718wCbSuE9L._AC_UF1000,1000_QL80_.jpg",
          "description": "A magical story of a hidden garden and the healing power of nature.",
          "year": 1911,
          "availableFormats": ["Paperback", "E-book"]
      },
      {
          "title": "Dune",
          "author": "Frank Herbert",
          "publisher": "Chilton Books",
          "publicationDate": "1965-08-01T00:00:00Z",
          "genre": "Science Fiction",
          "price": 1299.00,
          "imageUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Dune_%282021_film%29.jpg/220px-Dune_%282021_film%29.jpg",
          "description": "An epic tale of politics, religion, and survival on a desert planet.",
          "year": 1965,
          "availableFormats": ["Paperback", "Hardcover"]
      },
      {
          "title": "The Picture of Dorian Gray",
          "author": "Oscar Wilde",
          "publisher": "Ward, Lock & Co.",
          "publicationDate": "1890-06-20T00:00:00Z",
          "genre": "Philosophical Fiction",
          "price": 599.00,
          "imageUrl": "https://m.media-amazon.com/images/I/71fm0Ap7JcL._AC_UF1000,1000_QL80_.jpg",
          "description": "A story about the consequences of living a life devoted to pleasure.",
          "year": 1890,
          "availableFormats": ["Paperback", "E-book"]
      }
];

const insertData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(URI);
        console.log("Connected to MongoDB");

        // Insert data
        await Books.insertMany(BookData);
        console.log("Books inserted successfully");

        // Close the connection
        mongoose.connection.close();
    } catch (error) {
        console.error("Error inserting books:", error);
    }
};

// Run the insertion function
insertData();
