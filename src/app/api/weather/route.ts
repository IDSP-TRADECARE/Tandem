import { NextResponse } from 'next/server';

//will be sending a get request to a weather API and returning the data
//therefore get func
export async function GET(request: Request) {
  // get city from request
  const { searchParams } = new URL(request.url);
  //await a city param in url query and extract it
  const city = searchParams.get('city') || 'London';
  
  // since we assume a sent get request with a city, we are using that here
  try {
    // using wttr.in - no API key needed
    const response = await fetch(`https://wttr.in/${city}?format=j1`);
    
    if (!response.ok) {
      throw new Error('Weather API request failed');
    }
    
    // turn response to json
    const data = await response.json();
    const current = data.current_condition[0];
    const area = data.nearest_area[0];
    
    // wttr.in returns in this format
    return NextResponse.json({
      city: area.areaName[0].value,
      country: area.country[0].value,
      temperature: parseInt(current.temp_C),
    });
  } catch (err) {
    return NextResponse.json({ error: `Failed to fetch weather data, ${err}` }, { status: 500 });
  }
}