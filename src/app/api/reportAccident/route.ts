import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import { AccidentInput, Accident } from '@/models/accident'; 
import { Volunteer } from '@/models/volunteer'; 

connectDB();

export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    const { description, reporters, photos, videos, location, hospital, status } = await req.json();

    const accidentData: AccidentInput = {
      description: description || 'No description provided',
      reporters: reporters || ['default@example.com'],
      photos: photos || [],
      videos: videos || [],
      location: location || {
        type: 'Point',
        coordinates: [0, 0],
      },
      hospital: hospital || "No nearby hospitals found", 
      nearestVolunteers: [],
      status: status || 'Pending', 
    };

    const nearestVolunteers = await Volunteer.find({
      location: {
        $near: {
          $geometry: accidentData.location,
          $maxDistance: 5000,
        },
      },
    }).limit(2);

    console.log('The two volunteers are:', nearestVolunteers);

    accidentData.nearestVolunteers = nearestVolunteers.map(volunteer => volunteer._id.toString());

    const accident = new Accident(accidentData);
    await accident.save();

    for (const volunteer of nearestVolunteers) {
      volunteer.liveAccidents.push(accident._id);
      await volunteer.save();
    }

    return NextResponse.json({ message: 'Accident reported successfully!', nearestVolunteers: accidentData.nearestVolunteers });
  } catch (error) {
    console.error('Error reporting accident:', error);
    return NextResponse.json({ error: 'Failed to report accident' }, { status: 500 });
  }
};
