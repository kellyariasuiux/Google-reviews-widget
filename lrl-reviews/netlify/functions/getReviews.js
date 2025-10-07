// /.netlify/functions/getReviews
exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers };
  }

  const apiKey = process.env.GOOGLE_API_KEY; // set in Netlify UI later
  const placeId =
    (event.queryStringParameters && event.queryStringParameters.place_id) ||
    process.env.PLACE_ID; // optional: set in Netlify UI

  if (!apiKey || !placeId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Missing GOOGLE_API_KEY or PLACE_ID" })
    };
  }

  try {
    const url = new URL(
      "https://maps.googleapis.com/maps/api/place/details/json"
    );
    url.search = new URLSearchParams({
      place_id: placeId,
      fields: "name,rating,user_ratings_total,reviews",
      key: apiKey
    }).toString();

    const resp = await fetch(url);
    const data = await resp.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data.result || {})
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
