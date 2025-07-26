import { upload } from "@/lib/upload";

export const POST = async (request) => {
    try {
        const formData = await request.formData();
        console.log("FormData received:", formData);

        // Handle single file upload
        const singleFile = formData.get("file");
        if (singleFile) {
            console.log("Single file:", singleFile);
            const uploadedSingleFileUrl = await upload(singleFile);
            console.log("Uploaded single file URL:", uploadedSingleFileUrl);

            return Response.json(
                {
                    message: "Single file uploaded successfully!",
                    success: true,
                    file: uploadedSingleFileUrl,
                },
                { status: 200 }
            );
        }

        
        const multipleFiles = formData.getAll("files");
        console.log("Multiple files:", multipleFiles);

        const urlArray = [];
        for (const file of multipleFiles) {
            console.log("Uploading file:", file);
            const fileUrl = await upload(file);
            console.log("Uploaded file URL:", fileUrl);
            urlArray.push(fileUrl);
        }

        return Response.json(
            {
                message: "Files uploaded successfully!",
                success: true,
                files: urlArray,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error on file upload:", error);
        return Response.json(
            {
                message: "Error on file upload!",
                success: false,
            },
            { status: 500 }
        );
    }
};
