import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        // Remove deprecated options
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`🗄️  MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('📴 MongoDB disconnected');
        });

        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('🔒 MongoDB connection closed through app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error);
        console.log('💡 Make sure MongoDB is running or update MONGODB_URI in your .env file');
        console.log('💡 For local development, you can use MongoDB Atlas or install MongoDB locally');
        console.log('💡 To use MongoDB Atlas:');
        console.log('   1. Sign up at https://www.mongodb.com/atlas');
        console.log('   2. Create a free cluster');
        console.log('   3. Get your connection string');
        console.log('   4. Update MONGODB_URI in .env file');
        console.log('');
        console.log('💡 To install MongoDB locally:');
        console.log('   Ubuntu/Debian: sudo apt-get install mongodb');
        console.log('   macOS: brew install mongodb-community');
        console.log('   Windows: Download from https://www.mongodb.com/try/download/community');
        console.log('');
        console.log('💡 Quick MongoDB Atlas setup:');
        console.log('   1. Go to https://www.mongodb.com/atlas');
        console.log('   2. Create free account');
        console.log('   3. Create cluster (M0 free tier)');
        console.log('   4. Create database user');
        console.log('   5. Add IP address 0.0.0.0/0 (for development)');
        console.log('   6. Get connection string and update .env file');
        
        if (process.env.NODE_ENV === 'development') {
            console.log('');
            console.log('⚠️  Development mode: Server will start but database operations will fail.');
            console.log('   Set up MongoDB to use the full application features.');
        }
        
        process.exit(1);
    }
};