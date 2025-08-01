import { Request, Response } from "express";
import Content from "../model/Content";

export async function create_content(req: Request, res: Response) {
  const { title, link, type } = req.body;
  const userId = req.user?._id;

  try {
    await Content.create({
      title,
      link,
      type,
      tags: [],
      userId,
    });

    res.status(200).json({ message: "Content Added" });
  } catch (e) {
    console.error("Error creating content: ", e);
    res.status(500).json({ message: "Error in adding the content" });
  }
}

export async function get_content(req: Request, res: Response) {}
