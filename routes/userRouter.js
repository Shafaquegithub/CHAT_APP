import express from "express";
import registerUser from "../controller/register.js";
import { checkEmail } from "../controller/checkEmail.js";
import { checkPassword } from "../controller/checkPassword.js";
import { userDetails } from "../controller/userDetails.js";
import { logout } from "../controller/logout.js";
import { updateUserDetails } from "../controller/updateUserDeatils.js";
import { searchUser } from "../controller/searchUser.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/checkemail", checkEmail);
router.post("/checkpassword", checkPassword);
router.get("/userdetails", userDetails);
router.get("/logout", logout);
router.put("/update-user", updateUserDetails);
router.post("/search-user", searchUser);
export default router;
