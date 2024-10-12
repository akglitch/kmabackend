const express = require('express');
const bodyParser = require('body-parser');
const assemblyMembersRoutes = require('./src/routes/assemblyMembers');
const governmentAppointeeRoutes = require('./src/routes/governmentAppointees');
const subcommitteesRoutes = require('./src/routes/subcommitteeRoutes');
const memberRoutes = require('./src/routes/memberRoutes');
const connectDB = require('./src/config/db');
const cors = require('cors');
const routes = require('./src/routes');
const attendanceRoutes = require('./src/routes/attendanceRoutes');
const generalMeetingRoutes = require('./src/routes/generalMeetingRoutes')
const convenerMeetingRoutes = require('./src/routes/convenerMeetingRoutes')
const userRoutes = require('./src/routes/userRoutes')

const {initializeSubcommittees}  = require('./src/routes/subcommitteeRoutes')

connectDB().then(() => {
    initializeSubcommittees().catch(err => {
        console.error('Error initializing subcommittees:', err);
});

const app = express();
app.use(express.json());

 app.use(cors({
  origin: 'https://kmaapp.vercel.app', // Replace with your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use('/api', routes);
app.use('/api', assemblyMembersRoutes);
app.use('/api', governmentAppointeeRoutes);
app.use('/api', subcommitteesRoutes);
app.use('/api', memberRoutes);
app.use('/api',attendanceRoutes)
app.use('/api',generalMeetingRoutes)
app.use('/api',convenerMeetingRoutes)
app.use('/api',userRoutes)


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
});
