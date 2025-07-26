import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/model/Order";

export async function PATCH(req, { params }) {
    await dbConnect();

    try {
        const { id } = params;
        const { deliver } = await req.json();

        if (typeof deliver !== 'boolean') {
            return new Response(
                JSON.stringify({ 
                    message: "Invalid delivery status", 
                    success: false 
                }),
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const orderUpdate = await OrderModel.findByIdAndUpdate(
            id,
            { deliver, updatedAt: new Date() },
            { new: true }
        );

        if (!orderUpdate) {
            return new Response(
                JSON.stringify({ 
                    message: "Order not found", 
                    success: false 
                }),
                { 
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        return new Response(
            JSON.stringify({
                message: "Delivery status updated successfully",
                success: true,
                data: orderUpdate,
            }),
            { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (error) {
        console.error('Error updating delivery status:', error);
        return new Response(
            JSON.stringify({ 
                message: "Error updating delivery status", 
                success: false,
                error: error.message 
            }),
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}