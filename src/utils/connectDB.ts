import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string); 
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB successfully connected');
        });

        connection.on('error', (error: Error) => {
            console.error('MongoDB failed to connect:', error);
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error(`MongoDB connection failed: ${error.message}`);
        } 
        else {
            console.error('MongoDB connection failed:', error);
        }
    }
};

export default connectDB;
