"use server"
import { verifyToken } from "@/server/functions/token/token";

export const validateToken = async (token) => {
    try {
        const isValid = await verifyToken(token);
        console.log(isValid)
        if (!isValid) {
            return ({ 
                type: "error",
                success: false,
                message: "Invalid token"
            }, { status: 401 });
        }
        return ({ 
            type: "success",
            success: true,
            message: "Token is valid"
        }, { status: 200 });
    } catch (error) {
        console.error('Error validating token:', error);
        return ({ 
            type: "error",
            success: false,
            message: "Failed to validate token"
        }, { status: 500 });
    }
}
