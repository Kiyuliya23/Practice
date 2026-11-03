
import express from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../db/config.js";
import authenticateJWT from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE — создание поста
router.post("/", authenticateJWT, async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = req.user.id;

    // Проверка обязательных полей
    if (!title || !content || !author) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Проверка типов и значений
    if (
      typeof title !== "string" ||
      typeof content !== "string" ||
      !title.trim() ||
      !content.trim() ||
      typeof author !== "string" ||
      !ObjectId.isValid(author)
    ) {
      return res.status(400).json({
        message: "Invalid post data",
      });
    }

    // Проверка существования автора
    const authorId = new ObjectId(author);

    const user = await getDb()
      .collection("users")
      .findOne({ _id: authorId });

    if (!user) {
      return res.status(404).json({
        message: "Author not found",
      });
    }

    // Создание документа
    const newPost = {
      title: title.trim(),
      content: content.trim(),
      author: authorId,
      createdAt: new Date(),
    };

    // Сохранение в MongoDB
    const result = await getDb()
      .collection("posts")
      .insertOne(newPost);

    return res.status(201).json({
      message: "Post created successfully",
      postId: result.insertedId,
    });
  } catch (error) {
    console.error("Post creation error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// READ — получение всех постов
router.get("/", async (req, res) => {
  try {
    const posts = await getDb()
      .collection("posts")
      .find()
      .toArray();

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Getting posts error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;
