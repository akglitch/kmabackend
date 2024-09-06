const express = require('express');
const bodyParser = require('body-parser');
const assemblyMembersRoutes = require('./src/routes/assemblyMembers');
const governmentAppointeeRoutes = require('./src/routes/governmentAppointees');
const subcommitteesRoutes = require('./src/routes/subcommitteeRoutes');
const memberRoutes = require('./src/routes/memberRoutes');
const connectDB = require('./src/config/db');
const cors = require('cors');
const routes = require('./src/routes');
const authRoutes = require('./src/routes/auth');
const attendanceRoutes = require('./src/routes/attendanceRoutes');
const generalMeetingRoutes = require('./src/routes/generalMeetingRoutes')
const convenerMeetingRoutes = require('./src/routes/convenerMeetingRoutes')

const {initializeSubcommittees}  = require('./src/routes/subcommitteeRoutes')

connectDB().then(() => {
    initializeSubcommittees().catch(err => {
        console.error('Error initializing subcommittees:', err);
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api', routes);
app.use('/api', assemblyMembersRoutes);
app.use('/api', governmentAppointeeRoutes);
app.use('/api', subcommitteesRoutes);
app.use('/api', memberRoutes);
app.use('/api',attendanceRoutes)
app.use('/api',generalMeetingRoutes)
app.use('/api',convenerMeetingRoutes)

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
});