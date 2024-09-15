const { Router } = require('express');
const { registerUser, loginUser } = require('../controllers/userController');

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
