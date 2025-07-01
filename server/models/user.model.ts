import { Schema, model } from 'mongoose';

export interface IUser {
    name: string;
    email: string;
    createdAt: Date;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = model<IUser>('User', userSchema);

export default User;
