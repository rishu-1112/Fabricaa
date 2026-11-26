import express from "express";
import Fabric from "../models/fabric.js";

const router = express.Router();

// GET all fabrics
router.get("/", async (req, res) => {
  try {
    const fabrics = await Fabric.find();
    res.json(fabrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new fabric
router.post("/", async (req, res) => {
  try {
    const newFabric = new Fabric(req.body);
    const savedFabric = await newFabric.save();
    res.status(201).json(savedFabric);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET a single fabric by ID
router.get("/:id", async (req, res) => {
  try {
    const fabric = await Fabric.findById(req.params.id);
    if (!fabric) return res.status(404).json({ message: "Fabric not found" });
    res.json(fabric);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
