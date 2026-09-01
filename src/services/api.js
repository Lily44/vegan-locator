export const geocodeAddress = async (query) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
  );
  if (!response.ok) throw new Error("Failed to resolve address.");
  const data = await response.json();
  if (data.length === 0) throw new Error("Location not found.");
  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  };
};

export const fetchVeganVenues = async (lat, lon) => {
  // Corrected endpoint path to hit your Cloudflare Pages function
  const response = await fetch(`/api/yelp?lat=${lat}&lon=${lon}&term=vegan`);

  if (!response.ok) {
    throw new Error("Unable to fetch venues from Yelp.");
  }

  const data = await response.json();

  if (!data.businesses) {
    return [];
  }

  return data.businesses.map((b) => {
    let category = "Restaurants";
    const categoryTitles = b.categories.map((c) => c.title.toLowerCase());
    
    if (categoryTitles.some((c) => c.includes("coffee"))) {
      category = "Coffee Shops";
    } else if (categoryTitles.some((c) => c.includes("cafe") || c.includes("bakery") || c.includes("deli"))) {
      category = "Cafes";
    }

    const isOnlyVegan = categoryTitles.some((c) => c === "vegan");

    return {
      id: b.id,
      name: b.name,
      category,
      lat: b.coordinates.latitude,
      lon: b.coordinates.longitude,
      address: b.location.display_address.join(", "),
      rating: b.rating,
      reviewCount: b.review_count,
      imageUrl: b.image_url,
      isOnlyVegan,
      website: b.url,
      phone: b.display_phone,
    };
  });
};
