import connectDb from "../../../middleware/mongoose";
import Birthday from "../../../models/Birthday";

export default async function handler(req, res) {
  await connectDb();

  const { method } = req;

  if (method === "GET") {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ success: false, message: "userId is required" });
      }

      const record = await Birthday.findOne({ userId }).lean();
      return res.status(200).json({ success: true, data: record || null });

    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  if (method === "POST") {
    try {
      const { userId, name, birthday } = req.body;

      if (!userId || !name || !birthday) {
        return res.status(400).json({ success: false, message: "All fields required" });
      }

      let record = await Birthday.findOne({ userId });

      if (record) {
        record.name = name;
        record.birthday = birthday;
        await record.save();
      } else {
        record = await Birthday.create({ userId, name, birthday });
      }

      return res.status(200).json({ success: true, data: record });

    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
}
