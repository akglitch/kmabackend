const express = require('express');
const bodyParser = require('body-parser');
const assemblyMembersRoutes = require('./src/routes/assemblyMembers');
const governmentAppointeeRoutes = require('./src/routes/governmentAppointees');
const subcommitteesRoutes = require('./src/routes/subcommitteeRoutes');
const memberRoutes = require('./src/routes/memberRoutes');
const connectDB = require('./src/config/db');
const cors = require('cors');
const routes = require('./src/routes');

connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api', routes);
app.use('/api/assemblymembers', assemblyMembersRoutes);
app.use('/api/governmentappointees', governmentAppointeeRoutes);
app.use('/api/subcommittees', subcommitteesRoutes);
app.use('/api/members', memberRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
