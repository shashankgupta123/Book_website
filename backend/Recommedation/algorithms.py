from flask import Flask, request, jsonify
from pymongo import MongoClient, DESCENDING

MONGO_URI = "mongodb+srv://shashank0078:shashank123@cluster0.3dowa.mongodb.net/SEM_6?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client['SEM_6']
books_collection = db['books'] 
purchases_collection = db['purchases']
users_collection = db['users']  

def recommend_by_visit_count(user):
    book_visited_data = user.get("booksVisited", [])
    print("Book visited data:", book_visited_data)  
    if not book_visited_data:
        print("No books visited by user.")
        return []
    
    book_visited_sorted = sorted(book_visited_data, key=lambda book: book.get("visitCount", 0), reverse=True)
    print("Sorted book visited data:", book_visited_sorted) 
    
    max_visit_count = book_visited_sorted[0].get("visitCount", 0)
    print("Max visit count:", max_visit_count)  
    
    most_visited_books = []
    for book in book_visited_sorted:
        if book.get("visitCount", 0) == max_visit_count:
            most_visited_books.append({
                "title": book.get("title"),
                "author": book.get("author"),
                "description": book.get("description"),
                "visitCount": book.get("visitCount"),
                "price": book.get("price"),
                "image": book.get("imageUrl"),
                "id": str(book.get("_id"))
            })
    
    print("Most visited books:", most_visited_books)  
    return most_visited_books

def recommend_by_similarity(user):
    book_visited_data = user.get("booksVisited", [])
    print("Book visited data for similarity:", book_visited_data)  
    
    if not book_visited_data:
        print("No books visited by user for similarity.")
        return []
    
    base_book = max(book_visited_data, key=lambda book: book.get("visitCount", 0))
    print(f"Base book for similarity recommendation: {base_book}")  
    
    base_book_id = base_book.get("_id")
    
    similar_books = books_collection.find({"_id": {"$ne": base_book_id}}).limit(3)
    print(f"Querying MongoDB for books similar to base book with ID: {base_book_id}") 
    
    similar_book_list = []
    
    for book in similar_books:
        print(f"Book found in MongoDB: {book}")  
        
        similar_book = {
            "title": book.get("title"),
            "author": book.get("author"),
            "description": book.get("description"),
            "similarityScore": 85.0,  
            "price": book.get("price", "N/A"),
            "image": book.get("imageUrl", None),  
            "id": str(book.get("_id"))
        }
        similar_book_list.append(similar_book)
    
    print("Similar books based on user data:", similar_book_list)  
    return similar_book_list

def recommend_new_trends():
    try:
        # ✅ Read email from query parameters (optional)
        email = request.args.get('email')
        print(f"User email received: {email}")

        # ✅ Get top 3 most purchased books
        top_purchased_books = purchases_collection.aggregate([
            {"$group": {"_id": "$bookTitle", "purchaseCount": {"$sum": 1}}},
            {"$sort": {"purchaseCount": DESCENDING}},
            {"$limit": 3}
        ])
        top_purchased_titles = [book["_id"] for book in top_purchased_books]

        # ✅ Get top 3 most favorited books
        top_favorited_books = users_collection.aggregate([
            {"$unwind": "$favorites"},
            {"$group": {"_id": "$favorites", "favoriteCount": {"$sum": 1}}},
            {"$sort": {"favoriteCount": DESCENDING}},
            {"$limit": 3}
        ])
        top_favorited_titles = [book["_id"] for book in top_favorited_books]

        # ✅ Combine results (avoid duplicates)
        combined_titles = list(set(top_purchased_titles + top_favorited_titles))[:3]

        # ✅ Fetch book details
        trending_books = books_collection.find({"title": {"$in": combined_titles}})
        new_trend_list = []
        for book in trending_books:
            new_trend_list.append({
                "title": book.get("title"),
                "author": book.get("author"),
                "genre": book.get("genre", []),
                "price": book.get("price", "N/A"),
                "image": book.get("imageUrl"),
                "book_id": str(book.get("_id"))  # ✅ Convert ObjectId to string
            })

        return {"new_trends": new_trend_list}  # ✅ Return a dictionary, not a Response

    except Exception as e:
        return {"message": f"An error occurred: {str(e)}"}  # ✅ Return error as dict
           
def recommend_by_last_two_searches(user):
    search_history = user.get("searchhistory", [])
    print("Search history for last two searches:", search_history)  
    
    if len(search_history) < 3:
        print("Not enough search history for last two searches.")
        return []
    
    last_two_searches = list(dict.fromkeys(search_history[-3:]))  
    print("Unique last two searches:", last_two_searches) 
    search_results = []
    for search in last_two_searches:
        book = books_collection.find_one({"title": {"$regex": search, "$options": "i"}})
        if book:
            search_result = {
                "title": book.get("title"),
                "author": book.get("author"),
                "genre": book.get("genre", []),
                "price": book.get("price", "N/A"),
                "description": book.get("description", "No description available"),
                "image": book.get("imageUrl"),
                "id": str(book.get("_id")),
            }
            search_results.append(search_result)
    
    print("Search results based on last two searches:", search_results)  
    return search_results

def recommend_by_favourites(user):
    favourite_books = user.get("favourites", [])
    print(f"Debug: User's favourite books: {favourite_books}")  
    
    if not favourite_books:
        print("No favourite books for user.")
        return []
    
    fav_book_list = []
    for book in favourite_books:
        fav_book = {
            "title": book.get("title"),
            "author": book.get("author"),
            "genre": book.get("genre",[]),
            "price": book.get("price", "N/A"),
            "description": book.get("description", "No description available"),
            "image": book.get("imageUrl"),
            "id": str(book.get("_id")),  
        }
        fav_book_list.append(fav_book)
    
    print(f"Debug: Favourite book list: {fav_book_list}")  
    return fav_book_list
