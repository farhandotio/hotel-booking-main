import userModel from "../models/user.model.js";
import { Webhook } from "svix";

const clerkWebhook = async (req, res) => {
  try {
    const wHook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    await wHook.verify(JSON.stringify(req.body), headers);

    const { data, type } = req.body;

    const userData = {
      _id: data.id,
      email: data.email_addresses[0]?.email_address || "",
      username: data.first_name + " " + data.last_name,
      image: data.image_url,
    };

    switch (type) {
      case "user.created": {
        await userModel.create(userData);
        break;
      }
      case "user.updated": {
        await userModel.findByIdAndUpdate(data.id, userData);
        break;
      }
      case "user.deleted": {
        await userModel.findByIdAndDelete(data.id);
        break;
      }
      default:
        break;
    }
    res
      .status(200)
      .json({ success: true, message: "Webhook processed successfully" });
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .json({
        success: false,
        message: error.message || "Webhook processing failed",
      });
  }
};

export default clerkWebhook;