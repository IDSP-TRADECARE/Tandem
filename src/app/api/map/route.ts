import { NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Check if coordinates are provided instead of city
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const city = searchParams.get('city');
  
  if (!GOOGLE_API_KEY) {
    return NextResponse.json({ error: 'Google API key not found' }, { status: 500 });
  }
  
  try {
    let location;
    let cityName;
    
    if (lat && lng) {
      // Use provided coordinates
      location = { lat: parseFloat(lat), lng: parseFloat(lng) };
      
      // Reverse geocode to get city name
      const geocodeResponse = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
      );
      const geocodeData = await geocodeResponse.json();
      cityName = geocodeData.results[0]?.formatted_address || 'Your Location';
    } else {
      // Use city name (existing logic)
      const geocodeResponse = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city || 'London')}&key=${GOOGLE_API_KEY}`
      );
      const geocodeData = await geocodeResponse.json();
      
      if (geocodeData.results.length === 0) {
        return NextResponse.json({ error: 'City not found' }, { status: 404 });
      }
      
      location = geocodeData.results[0].geometry.location;
      cityName = geocodeData.results[0].formatted_address;
    }
    
    // Search for nearby daycares
    const placesResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=5000&keyword=daycare&key=${GOOGLE_API_KEY}`
    );
    
    const placesData = await placesResponse.json();
    
    // Get detailed info for each place
    const detailedDaycares = await Promise.all(
      placesData.results.slice(0, 5).map(async (place: { place_id: string; name: string; vicinity: string; rating?: number }) => {
        try {
          // Get place details for contact info and hours
          const detailsResponse = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,opening_hours,website&key=${GOOGLE_API_KEY}`
          );
          const detailsData = await detailsResponse.json();
          const details = detailsData.result;
          
          return {
            name: place.name,
            address: place.vicinity,
            rating: place.rating || 'No rating',
            phone: details.formatted_phone_number || 'No phone available',
            website: details.website || 'No website available',
            hours: details.opening_hours?.weekday_text || ['Hours not available']
          };
        } catch (error) {
          // If details request fails, return basic info
          return {
            name: place.name,
            address: place.vicinity,
            rating: place.rating || 'No rating',
            phone: 'No phone available',
            website: 'No website available',
            hours: ['Hours not available'],
            error: `Error: ${error}`
          };
        }
      })
    );
    
    return NextResponse.json({
      city: cityName,
      coordinates: location,
      daycares: detailedDaycares
    });
    
  } catch (err) {
    return NextResponse.json({ error: `Failed to fetch daycare data: ${err}` }, { status: 500 });
  }
}