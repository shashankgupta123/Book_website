import express from "express";
import controller from "../Controllers/user-controller.js";

const router = express.Router();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/",controller.getAllUsers);
router.post("/logout",controller.logout);
router.post("/adminlogout",controller.adminlogout);

router.post("/store-search",controller.searchData);

router.post("/record-visit",controller.recordBookVisit);
router.post("/add-favourite",controller.addFavouriteBook);
export default router;