export const validateBook = (req, res, next) => {
    const { title, author, publisher, publicationDate, genre, price, imageUrl, description, year, availableFormats } = req.body;

    if (!title || !author || !publisher || !publicationDate || !genre || !price || !imageUrl || !year || !availableFormats) {
        return res.status(400).json({ message: "Required fields are missing" });
    }

    next();
};
