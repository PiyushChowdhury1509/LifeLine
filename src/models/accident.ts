import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

const accidentSchemaZod = z.object({
    description: z.string().optional(),
    photos: z.array(z.string()).optional(),
    videos: z.array(z.string()).optional(),
    reporters: z.array(z.string()).optional(),
    nearestVolunteers: z.array(z.string()).optional(),
    hospital: z.string().optional(),
    location: z.object({
        type: z.literal('Point'),
        coordinates: z.array(z.number()).length(2, "Coordinates must have exactly two numbers"),
    }),
    status: z.enum(['Pending', 'In Progress', 'Resolved', 'Cancelled']).default('Pending'),
});

type AccidentInput = z.infer<typeof accidentSchemaZod>;

interface IAccident extends Document, AccidentInput {}

const AccidentSchema = new Schema<IAccident>({
    description: {
        type: String,
    },
    photos: [{
        type: String,
    }],
    videos: [{
        type: String,
    }],
    reporters: [{
        type: String,
    }],
    nearestVolunteers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Volunteer',
    }],
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
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
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved', 'Cancelled'],
        default: 'Pending',
    },
}, {
    timestamps: true,
});

AccidentSchema.index({ location: '2dsphere' });

const Accident = mongoose.models.Accident || mongoose.model<IAccident>('Accident', AccidentSchema);
export { Accident, accidentSchemaZod };
export type { AccidentInput };
