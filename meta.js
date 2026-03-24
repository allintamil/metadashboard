export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { endpoint, token, ...params } = req.query;

  if (!endpoint || !token) {
    return res.status(400).json({ error: 'Missing endpoint or token' });
  }

  try {
    const queryParams = new URLSearchParams({ ...params, access_token: token });
    const url = `https://graph.facebook.com/v19.0/${endpoint}?${queryParams}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
}
