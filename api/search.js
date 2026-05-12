export default async function handler(req, res) {
  // Allow CORS from anywhere
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { query, placeId } = req.query;
  const API_KEY = process.env.GOOGLE_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    if (placeId) {
      // Get place details
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,website,formatted_address,rating&key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      return res.status(200).json(data);
    } else if (query) {
      // Text search
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      return res.status(200).json(data);
    } else {
      return res.status(400).json({ error: 'Missing query or placeId parameter' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Search failed', details: error.message });
  }
}
