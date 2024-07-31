const express = require('express');
const bodyParser = require('body-parser');
const assemblyMembersRoutes = require('./src/routes/assemblyMembers');
const governmentAppointeeRoutes = require('./src/routes/governmentAppointees');
const subcommitteesRoutes = require('./src/routes/subcommitteeRoutes');
const memberRoutes = require('./src/routes/memberRoutes');
const connectDB = require('./src/config/db');
const cors = require('cors');
const routes = require('./src/routes');

const {initializeSubcommittees}  = require('./src/routes/subcommitteeRoutes')

connectDB().then(() => {
    initializeSubcommittees().catch(err => {
        console.error('Error initializing subcommittees:', err);
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api', routes);
app.use('/api', assemblyMembersRoutes);
app.use('/api', governmentAppointeeRoutes);
app.use('/api', subcommitteesRoutes);
app.use('/api', memberRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
});