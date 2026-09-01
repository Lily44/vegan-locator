// Geocoding city/address using OpenStreetMap Nominatim API
export const geocodeAddress = async (query) => {
  // Added an email parameter to identify the app to OSM servers (Required for production domains)
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&email=hello@vegan-locator.pages.dev`
  );
  if (!response.ok) throw new Error("Failed to resolve address.");
  const data = await response.json();
  if (data.length === 0) throw new Error("Location not found. Try another city or zip code.");
  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  };
};

// Querying Vegan venues via OpenStreetMap Overpass API with Fallbacks
export const fetchVeganVenues = async (lat, lon, radiusInMeters = 5000) => {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"~"restaurant|cafe|fast_food"](around:${radiusInMeters},${lat},${lon});
      way["amenity"~"restaurant|cafe|fast_food"](around:${radiusInMeters},${lat},${lon});
    );
    out center;
  `;

  const bodyData = `data=${encodeURIComponent(query)}`;

  // Array of public Overpass API mirrors
  const endpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
    "https://z.overpass-api.de/api/interpreter"
  ];

  let response;
  
  // Loop through endpoints until one works
  for (const endpoint of endpoints) {
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: bodyData,
      });
      
      // If successful, break out of the loop
      if (response.ok) break;
    } catch (err) {
      console.warn(`Connection refused by ${endpoint}. Trying backup server...`);
    }
  }

  if (!response || !response.ok) {
    throw new Error("The map servers are currently too busy. Please try again in a moment.");
  }

  const data = await response.json();

  const formatted = data.elements
    .map((el) => {
      const tags = el.tags || {};
      const centerLat = el.lat || el.center?.lat;
      const centerLon = el.lon || el.center?.lon;

      if (!centerLat || !centerLon) return null;

      let category = "Restaurants";
      if (tags.amenity === "cafe") {
        const isCoffee = tags.cuisine?.includes("coffee") || tags.name?.toLowerCase().includes("coffee");
        category = isCoffee ? "Coffee Shops" : "Cafes";
      }

      const dietVegan = tags["diet:vegan"];
      const isOnlyVegan = dietVegan === "only" || tags["vegan"] === "only";
      const isVeganFriendly =
        dietVegan === "yes" ||
        tags["vegan"] === "yes" ||
        tags.cuisine?.includes("vegan") ||
        tags.name?.toLowerCase().includes("vegan") ||
        tags.description?.toLowerCase().includes("vegan");

      if (!isOnlyVegan && !isVeganFriendly) return null;

      const street = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ");
      const city = tags["addr:city"] || "";
      const address = [street, city].filter(Boolean).join(", ") || "Address not provided";

      return {
        id: el.id,
        name: tags.name || "Unnamed Vegan Spot",
        category,
        lat: centerLat,
        lon: centerLon,
        address,
        isOnlyVegan,
        website: tags.website || tags["contact:website"] || null,
        phone: tags.phone || tags["contact:phone"] || null,
      };
    })
    .filter(Boolean);

  return formatted;
};

