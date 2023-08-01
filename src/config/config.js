import { connect } from "mongoose";

const config = {
  connectDB: async () => {
    try {
      await connect(procces.env.MONGO_LINK);
    } catch (error) {
      console.log("error connecting database");
    }
  },
};

export default config;
