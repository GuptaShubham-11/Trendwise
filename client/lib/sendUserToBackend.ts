import axios from "@/lib/axios";
import { Session } from "next-auth";

export const sendUserToBackend = async (session: Session) => {
    if (!session?.user) return;

    try {
        const response = await axios.post("/users/authenticate", {
            name: session.user.name,
            email: session.user.email,
        });

        localStorage.setItem('user', JSON.stringify(response.data.data));
    } catch (err) {
        console.error("Error sending user:", err);
    }
};
