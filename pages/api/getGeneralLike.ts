import { NextApiRequest, NextApiResponse } from "next";
import { getLikedBy } from "@/lib/accountServerManager";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { filePath } = req.body;
    const likedBy = await getLikedBy(filePath);
    res.status(200).json({ likedBy });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
