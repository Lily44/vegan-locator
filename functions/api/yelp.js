export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");
  const term = url.searchParams.get("term") || "vegan";

  if (!lat || !lon) {
    return new Response(JSON.stringify({ error: "Missing coordinates" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Fetch data securely from Yelp server-side
  const yelpUrl = `https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lon}&term=${encodeURIComponent(
    term
  )}&categories=restaurants,food,cafes&radius=8000&limit=30`;

  try {
    const yelpRes = await fetch(yelpUrl, {
      headers: {
        Authorization: `Bearer ${env.YELP_API_KEY}`,
      },
    });

    const data = await yelpRes.json();

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch from Yelp" }), {
      status: 500,
    });
  }
}
