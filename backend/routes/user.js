const router = require("express").Router();
let user = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_secret_key';
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

// //update user
// router.route("/update/:id").put((req, res) => {
//   user.findById(req.params.id)
//     .then(user => {
//       user.firstName = req.body.firstName;
//       user.lastName = req.body.lastName;
//       user.email = req.body.email;
//       user.homeAddress = req.body.homeAddress;
//       user.phoneNumber = req.body.phoneNumber;
//       user.role = req.body.role;
//       user.password = req.body.password;

//       user.save()
//         .then(() => res.json('User updated!'))
//         .catch(err => res.status(400).json('Error: ' + err));
//     })
//     .catch(err => res.status(400).json('Error: ' + err));
// });

// Update the user route to handle optional password updates
router.route("/update/:id").put(async (req, res) => {
  try {
    const foundUser = await user.findById(req.params.id);
    
    if (!foundUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic fields
    foundUser.firstName = req.body.firstName || foundUser.firstName;
    foundUser.lastName = req.body.lastName || foundUser.lastName;
    foundUser.email = req.body.email || foundUser.email;
    foundUser.homeAddress = req.body.homeAddress || foundUser.homeAddress;
    foundUser.phoneNumber = req.body.phoneNumber || foundUser.phoneNumber;
    
    // Only update password if provided
    if (req.body.password) {
      // In production, hash the password here
      foundUser.password = req.body.password;
    }

    // Save the updated user
    const updatedUser = await foundUser.save();
    
    // Remove password from response
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({
      message: 'Error updating user',
      error: error.message
    });
  }
});

//delete user
router.route("/delete/:id").delete((req, res) => {
  user.findByIdAndDelete(req.params.id)
    .then(() => res.json('User deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

//get user by id
router.get("/:id", async (req, res) => {
  try {
    
    const foundUser = await user.findById(req.params.id).select('-password');
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(foundUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: error.message });
  }
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
})
// User login

// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   const user = await user.findOne({ email });

//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(401).json({ message: 'Invalid credentials' });
//   }

//   const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
//   res.json({ token, user });
// });

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