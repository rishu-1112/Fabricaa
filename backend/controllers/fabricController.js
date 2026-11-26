const Fabric = require('../models/Fabric');

exports.getFabrics = async (req, res) => {
  try {
    const fabrics = await Fabric.find().sort({ createdAt: -1 });
    res.json(fabrics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
