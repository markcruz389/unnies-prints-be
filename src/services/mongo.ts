import mongoose from 'mongoose';

mongoose.connection.once('open', () => console.log('Connected to MongoDB'));
mongoose.connection.once('error', (err) =>
    console.log('Error connecting to MongoDB - ' + err)
);

const mongoConnect = async (connectionString: string) => {
    await mongoose.connect(connectionString);
};

const monngoDisconnect = async () => {
    await mongoose.disconnect();
};

export { mongoConnect, monngoDisconnect };
