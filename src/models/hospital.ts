import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

const hospitalSchemaZod = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    address: z.object({
        street: z.string(),
        city: z.string(),
        postalCode: z.string(),
        country: z.string(),
    }),
    contactNumber: z.string(),
    emergencyContactNumber: z.string(),
    geoLocation: z.object({
        type: z.literal('Point'),
        coordinates: z.array(z.number()).length(2, "Coordinates must have exactly two numbers"),
    }),
});

type HospitalInput = z.infer<typeof hospitalSchemaZod>;

interface IHospital extends Document, HospitalInput {}

const hospitalSchema = new Schema<IHospital>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    address: {
        street: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
    },
    contactNumber: {
        type: String,
        required: true,
    },
    emergencyContactNumber: {
        type: String,
        required: true,
    },
    geoLocation: {
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
}, { timestamps: true });

hospitalSchema.index({ geoLocation: '2dsphere' });

const Hospital = mongoose.models.Hospital || mongoose.model<IHospital>('Hospital', hospitalSchema);

export { Hospital, hospitalSchemaZod };
export type { HospitalInput }; 
