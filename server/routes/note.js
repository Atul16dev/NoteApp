import express from "express";
import Note from "../models/Note.js";
import middleware from "../middleware.js";

const router = express.Router();

router.post("/add", middleware, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    if (
      typeof title !== "string" ||
      title.trim().length < 3 ||
      title.trim().length > 80 ||
      typeof description !== "string" ||
      !description.trim() ||
      description.trim().length > 2000 ||
      (tag !== undefined && typeof tag !== "string")
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid title and note.",
      });
    }

    const newNote = new Note({
      title: title.trim(),
      description: description.trim(),
      tag:
        typeof tag === "string" && tag.trim()
          ? tag.trim().slice(0, 32)
          : "General",
      user: req.user.id,
    });

    await newNote.save();

    return res
      .status(200)
      .json({
        success: true,
        message: "Note Created Successfully",
        note: newNote,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error in Adding Note" });
  }
});

router.get("/", middleware, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    return res.status(200).json({ success: true, notes });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Can't retrive notes" });
  }
});

router.put("/:id", middleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tag } = req.body;

    if (
      typeof title !== "string" ||
      title.trim().length < 3 ||
      title.trim().length > 80 ||
      typeof description !== "string" ||
      !description.trim() ||
      description.trim().length > 2000 ||
      (tag !== undefined && typeof tag !== "string")
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid title and note.",
      });
    }

    const note = await Note.findOneAndUpdate(
      { _id: id, user: req.user.id },
      {
        title: title.trim(),
        description: description.trim(),
        tag:
          typeof tag === "string" && tag.trim()
            ? tag.trim().slice(0, 32)
            : "General",
      },
      { returnDocument: "after", runValidators: true },
    );

    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found." });
    }

    return res.status(200).json({ success: true, note });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Can't update notes" });
  }
});

router.delete("/:id", middleware, async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOneAndDelete({ _id: id, user: req.user.id });

    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found." });
    }

    return res.status(200).json({ success: true, note });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Can't delete note" });
  }
});

export default router;
