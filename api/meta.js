export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { endpoint, token, ...params } = req.query;

    if (!endpoint || !token) {
      return res.status(400).json({ error: { message: 'Missing endpoint or token' } });
    }

    const queryParams = new URLSearchParams({ access_token: token });
    Object.entries(params).forEach(([k, v]) => queryParams.append(k, v));

    const url = `https://graph.facebook.com/v19.0/${endpoint}?${queryParams.toString()}`;

    const response = await fetch(url);
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch(e) {
      return res.status(500).json({ error: { message: 'Meta API returned invalid response: ' + text.slice(0, 200) } });
    }

    if (data.error) {
      return res.status(400).json({ error: data.error });
    }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
}
