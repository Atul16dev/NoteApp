import express from "express";
import Note from "../models/Note.js";
import middleware from "../middleware.js";

const router = express.Router();

router.post("/add", middleware, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    const newNote = new Note({
      title,
      description,
      tag,
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
    console.log("req.user.id =", req.user.id);//ch
    const notes = await Note.find({user: req.user.id});
    console.log("Fetched Notes =", notes);//ch
    return res.status(200).json({ success: true, notes });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Can't retrive notes" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateNote = await Note.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json({ success: true, note: updateNote });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Can't update notes" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateNote = await Note.findByIdAndDelete(id, {
      new: true,
    });
    return res.status(200).json({ success: true, note: updateNote });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Can't update notes" });
  }
});

export default router;
