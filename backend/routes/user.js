const router = require("express").Router();
let user = require("../models/user");

// Add a new user
router.route("/add").post((req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const homeAddress = req.body.homeAddress;
  const phoneNumber = req.body.phoneNumber;
  const role = req.body.role;
  const password = req.body.password;

  const newUser = new user({
    firstName,
    lastName,
    email,
    homeAddress,
    phoneNumber,
    role,
    password,
  });

  newUser
    .save()
    .then(() => res.json("User added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Get all users
router.route("/").get((req, res) => {
  user.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
}); 

//update user
router.route("/update/:id").put((req, res) => {
  user.findById(req.params.id)
    .then(user => {
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.email = req.body.email;
      user.homeAddress = req.body.homeAddress;
      user.phoneNumber = req.body.phoneNumber;
      user.role = req.body.role;
      user.password = req.body.password;

      user.save()
        .then(() => res.json('User updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

//delete user
router.route("/delete/:id").delete((req, res) => {
  user.findByIdAndDelete(req.params.id)
    .then(() => res.json('User deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

//get user by id
router.route("/get/:id").get((req, res) => {
  user.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

//get user by email
router.route("/getByEmail/:email").get((req, res) => {
  user.findOne({ email: req.params.email })
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

//get user by phone number
router.route("/getByPhoneNumber/:phoneNumber").get((req, res) => {
  user.findOne({ phoneNumber: req.params.phoneNumber })
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

// User login
router.route("/login").post((req, res) => {
  const { email, password } = req.body;

  user.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.password !== password) { // Note: In production, use proper password hashing
        return res.status(401).json({ message: "Invalid password" });
      }

      res.json({
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        }
      });
    })
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;