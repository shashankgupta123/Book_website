import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../API/auth";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Home from "../Pages/Home";
import AddBook from '../Admin/Books/AddBook';
import BookList from '../Pages/BookList';
import UsersList from '../Admin/Users/UserList';
import Admin from '../Admin/AdminPage';
import AdminBookList from '../Admin/Books/AdminBookList';
import UpdateBook from '../Admin/Books/UpdateBook';
import AdminLayout from '../Layout/AdminLayout';
import UserLayout from '../Layout/UserLayout';
import Search from '../Pages/Search';
import GetBook from "../Pages/GetBook";
import TrendingBooks from '../component/Recommendation/TrendingBook';
import SimilarBooks from '../component/Recommendation/SimilarBook';
import MostVisitedBooks from '../component/Recommendation/MostVisted';
import LastSearches from '../component/Recommendation/LastSearch';
import FavouriteBooks from '../component/Recommendation/Favourite';
import Map from '../Pages/Map';
import Contact_Us from '../Admin/Contact/Contact_Us';
import Success from '../Pages/Success';
import Cancel from '../Pages/Cancel';
import About from '../Pages/About';
import Contact from '../Pages/Contact';
import Purchase from '../Admin/Purchase/Purchase';
import PurchaseDetail from '../Admin/Purchase/PurchaseDetails';
import Location from '../Admin/Location/Location';

function AppRouter() {
    const token = localStorage.getItem("token");
    const admin = localStorage.getItem("admin") === "true" 

    return (
        // <AuthProvider>
                <Routes>
                    {/* Common Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* User Routes */}
                    {!admin && (
                        <>
                            <Route path="/" element={<UserLayout><Home /></UserLayout>} />
                            <Route path="/user-books" element={<UserLayout><BookList /></UserLayout>} />
                            <Route path="/search-results" element={<UserLayout> <Search/> </UserLayout>}/>
                            <Route path="/books/details/:title" element={ <UserLayout> <GetBook /></UserLayout>} />
                            <Route path="/trending" element={<UserLayout><TrendingBooks/></UserLayout>} />
                            <Route path="/similar-books" element={<UserLayout><SimilarBooks/></UserLayout>} />
                            <Route path="/mostvisited-books" element={<UserLayout><MostVisitedBooks/></UserLayout>} />
                            <Route path="/lastsearch" element={<UserLayout><LastSearches/></UserLayout>} />
                            <Route path="/favourities" element={<UserLayout><FavouriteBooks/></UserLayout>} />
                            <Route path="/map" element={<UserLayout><Map/></UserLayout>} />
                            <Route path="/success" element={<UserLayout><Success/></UserLayout>}/>
                            <Route path="/cancel" element={<UserLayout><Cancel/></UserLayout>}/>
                            <Route path="/about" element={<UserLayout><About/></UserLayout>}/>
                            <Route path="/contact" element={<UserLayout><Contact/></UserLayout>}/>
                        </>
                    )}

                    {/* Admin Routes */}
                    {admin && (
                        <>
                            <Route path="/admin-dashboard" element={<AdminLayout><Admin /></AdminLayout>} />
                            <Route path="/admin/books" element={<AdminLayout><AdminBookList /></AdminLayout>} />
                            <Route path="/admin/users" element={<AdminLayout><UsersList /></AdminLayout>} />
                            <Route path="/books/add" element={<AdminLayout><AddBook /></AdminLayout>} />
                            <Route path="/books/update/:title" element={<AdminLayout><UpdateBook /></AdminLayout>} />
                            <Route path="/admin/contact" element={<AdminLayout><Contact_Us/></AdminLayout>} />
                            <Route path="/admin/purchase" element={<AdminLayout><Purchase/></AdminLayout>}/>
                            <Route path='/purchase-details/:id' element={<AdminLayout><PurchaseDetail/></AdminLayout>}/>
                            <Route path="/admin/location" element={<AdminLayout><Location/></AdminLayout>}/>
                        </>
                    )}
                </Routes>
        // </AuthProvider>
    );
}

export default AppRouter;
