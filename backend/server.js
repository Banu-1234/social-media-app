const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express()

const User = require("./models/User")
const Post = require("./models/Post")

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb://localhost:27017/socialmedia")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err))

// Create User
app.post("/users", async (req, res) => {
  try {
    const { username, bio } = req.body
    if (!username) return res.status(400).json({ error: "Username is required" })
    const user = new User({ username, bio })
    await user.save()
    res.status(201).json(user)
  } catch (err) {
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get All Users
app.get("/users", async (req, res) => {
  const users = await User.find()
  res.json(users)
})

// Create Post
app.post("/posts", async (req, res) => {
  try {
    const { user, content } = req.body
    if (!user || !content) return res.status(400).json({ error: "User ID and content required" })
    const userExists = await User.findById(user)
    if (!userExists) return res.status(404).json({ error: "User not found" })
    const post = new Post({ user, content })
    await post.save()
    res.status(201).json(post)
  } catch (err) {
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get All Posts
app.get("/posts", async (req, res) => {
  const posts = await Post.find().populate("user")
  res.json(posts)
})

// Like Post
app.post("/like/:postId/:userId", async (req, res) => {
  const { postId, userId } = req.params
  const post = await Post.findById(postId)
  if (!post.likes.includes(userId)) {
    post.likes.push(userId)
    await post.save()
  }
  res.json({ success: true })
})

// Add Comment
app.post("/comment/:postId", async (req, res) => {
  const { postId } = req.params
  const { text } = req.body
  const post = await Post.findById(postId)
  post.comments.push({ text })
  await post.save()
  res.json({ success: true })
})

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"))
