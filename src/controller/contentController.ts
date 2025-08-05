import { Request, Response } from "express";
import Content from "../model/Content";
import RandomStringGenerator from "../lib/RandomStringGenerator";
import Link from "../model/Link";

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

// Fetching all existing content of the user
export async function get_content(req: Request, res: Response) {
  const userId = req.user?._id;

  const savedContents = await Content.find({ userId });

  if (!savedContents) {
    return res.status(404).json({ message: "No content found" });
  }

  return res.status(200).json({ contents: savedContents });
}

// Creating a sharable link
export async function create_sharable_link(req: Request, res: Response) {
  const userId = req.user?._id;

  const randomString = RandomStringGenerator.generate(15);
  await Link.create({ hash: randomString, userId });

  const sharableLink = "localhost:3000/share/" + randomString;

  res
    .status(200)
    .json({ message: "Sharable link created", link: sharableLink });
}

// Returning all the user's contents at their sharable link
export async function get_sharable_link_content(req: Request, res: Response) {
  const unique_string = req.params.unique_string;

  const link = await Link.findOne({ hash: unique_string });

  if (!link) {
    return res.status(404).json({ message: "Sharable link not found" });
  }

  const userId = link.userId;

  const contents = await Content.find({ userId: userId });

  return res.status(200).json({ contents });
}

// Implement this
export async function delete_sharable_link(req: Request, res: Response) {
  res.status(200).json({ message: "Sharable link deleted" });
}
