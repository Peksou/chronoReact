var express = require('express');
var router = express.Router();
const Time = require('../models/times');
const User = require('../models/users');

// -- POST - CREER UN TEMPS -- //
router.post('/', async (req, res) => {
  const {duration} = req.body;
  try {
    const newTime = new Time({duration});
    console.log("nouveau temps enregistrée :", newTime);
    await newTime.save();
    res.status(201).json(newTime);
  }catch (error) {
    res.status(400).json({rerror: error.message})
  }
})
  
// -- GET - LIRE LES TEMPS -- //
router.get('/', async (req, res) => {
  try {
const times = await Time.find().sort({date: -1})
  res.status(200).json(times);
  } catch (error) {
    res.status(400).json({rerror: error.message})
  }
})

module.exports = router;