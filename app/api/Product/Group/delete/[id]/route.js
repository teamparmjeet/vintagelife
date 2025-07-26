import dbConnect from "@/lib/dbConnect";
import ProductGroupModel from "@/model/ProductGroup";
import ProductModel from "@/model/Product";

export async function DELETE(req, { params }) {
    await dbConnect();

    try {
        const { id } = params;

        // Find the group by ID to get the group name
        const group = await ProductGroupModel.findById(id);

        if (!group) {
            return Response.json({
                message: "Group not found",
                success: false
            }, { status: 404 });
        }

        // Check if there are any products with the same group name
        const productsInGroup = await ProductModel.find({ group: group.groupname });

        if (productsInGroup.length > 0) {
            return Response.json({
                message: "Cannot delete group because there are products associated with it",
                success: false
            }, { status: 400 }); // Return 400 Bad Request as the error type
        }

        // Delete the group if no products are associated
        const deletedGroup = await ProductGroupModel.findByIdAndDelete(id);

        return Response.json({
            message: "Group deleted successfully",
            success: true
        }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({
            message: "Error deleting Group",
            success: false
        }, { status: 500 });
    }
}
