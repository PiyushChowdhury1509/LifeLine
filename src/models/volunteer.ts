import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

const volunteerSchemaZod = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    verifyToken: z.string().min(1, "Verify token is required"),
    verified: z.boolean().default(false),
    location: z.object({
        type: z.literal('Point'),
        coordinates: z.array(z.number()).length(2, "Coordinates must have exactly two numbers"),
    }),
    liveAccidents: z.array(z.string()).optional(),
    solvedAccidents: z.array(z.string()).optional(),
    unsolvedAccidents: z.array(z.string()).optional(),
});

type VolunteerInput = z.infer<typeof volunteerSchemaZod>;

interface IVolunteer extends Document, VolunteerInput {}

const volunteerSchema = new Schema<IVolunteer>({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    verifyToken: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    liveAccidents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Accident',
    }],
    solvedAccidents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Accident',
    }],
    unsolvedAccidents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Accident',
    }],
}, { timestamps: true });

const Volunteer = mongoose.models.Volunteer || mongoose.model<IVolunteer>("Volunteer", volunteerSchema);

export { Volunteer, volunteerSchemaZod };
export type { VolunteerInput }; 
