import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const Role = new mongoose.Schema(
  {
    roleName: String,
    permissions: {
      type: [
        {
          module: String,
          read: Boolean,
          write: Boolean,
          delete: Boolean,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

Role.plugin(mongooseDelete, { overrideMethods: true });

export default mongoose.model("roles", Role);
