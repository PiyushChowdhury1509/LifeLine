import { NextResponse } from 'next/server';
import cloudinary from 'cloudinary';
import { NextRequest } from 'next/server'; 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function parseFormData(req: NextRequest): Promise<File[]> {
  const formData = await req.formData();
  const files = formData.getAll('file') as File[]; 
  return files;
}

export const POST = async (req: NextRequest) => {
  try {
    const files = await parseFormData(req);
    console.log('Received files:', files);
    console.log('Number of files received:', files.length);

    const uploadFile = async (file: File): Promise<string> => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      console.log('Uploading file type:', file.type);

      const fileType = file.type.startsWith('video/') ? 'video' : 'image'; // Adjusted to match standard MIME types

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { resource_type: fileType, folder: 'accidents' },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              console.log(`Uploaded ${fileType} URL:`, result.secure_url);
              resolve(result.secure_url);
            }
          }
        );

        uploadStream.end(buffer);
      });
    };

    const uploadPromises = files.map(uploadFile);
    const urls = await Promise.all(uploadPromises);

    console.log('All uploaded URLs:', urls);

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 });
  }
};
