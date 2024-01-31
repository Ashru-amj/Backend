import mongoose from "mongoose";

// const DatabaseConnect = mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => {
//     console.log("MongoDB connected successfully");
//   })
//   .catch((error) => {
//     console.error("MongoDB connection error:", error);
//   });
// export default DatabaseConnect;

const dbConnect = async () => {
  try {
    console.log(process.env.MONGODB_URL)
    const conection = await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database not connected");
    console.log(error)
    
  }
};

export default dbConnect;
