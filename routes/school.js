import express from "express";
import pool from '../db/connection.js';

const router = express.Router();

router.post('/addSchool', async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {

    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    await pool.query(query, [name, address, latitude, longitude]);
    res.status(201).json({ message: 'School added successfully' });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Database error' });

  }
});


router.get('/listSchools', async (req, res) => {
  const { latitude, longitude } = req.query;

  if (typeof latitude === 'undefined' || typeof longitude === 'undefined') {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  const userLat = parseFloat(latitude);
  const userLon = parseFloat(longitude);

  try {
    
    const [rows] = await pool.query('SELECT * FROM schools');
    const schoolsWithDistance = rows.map((school) => {
      const distance = calculateDistance(userLat, userLon, school.latitude, school.longitude);
      return { ...school, distance };
    });

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);
    res.status(200).json(schoolsWithDistance);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Database error' });
    
  }
});

function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (degree) => (degree * Math.PI) / 180;
  const R = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default router;