const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User')

const registerUser = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error });
    }
  };


  const loginUser = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign(
        { userId: user._id, username: user.username }, // Include username in the token
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // Return the token and the user's username
      res.json({ token, username: user.username });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  };
  




module.exports = {
  registerUser,
  loginUser
};
