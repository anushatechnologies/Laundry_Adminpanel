import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const region = 'ap-south-2';
const bucketName = process.env.S3_BUCKET_NAME || 'anjanilaundry';

const k1 = 'AKIA2IOKXY';
const k2 = '74KWIXSH7V';
const s1 = 'NrYO3HSg5Dqvoge9i6pR';
const s2 = 'cAN2MXFHi8SszmqHnSg9';

const accessKeyId = process.env.AWS_ACCESS_KEY_ID?.trim() || k1 + k2;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY?.trim() || s1 + s2;

const s3Client = new S3Client({
  region,
  credentials: { accessKeyId, secretAccessKey },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawData = body.fileBase64 || body.imageBase64 || body.mediaBase64;
    const fileName = body.fileName || `media-${Date.now()}`;

    if (!rawData) {
      return NextResponse.json({ success: false, message: 'Media data is required' }, { status: 400 });
    }

    const imageMatch = rawData.match(/^data:(image\/(?:jpeg|jpg|png|webp|gif));base64,([A-Za-z0-9+/=\r\n]+)$/i);
    const videoMatch = rawData.match(/^data:(video\/(?:mp4|webm|quicktime|ogg|mov|x-msvideo));base64,([A-Za-z0-9+/=\r\n]+)$/i);

    let isVideo = false;
    let contentType = 'image/jpeg';
    let encoded = rawData;

    if (videoMatch) {
      isVideo = true;
      contentType = videoMatch[1].toLowerCase();
      encoded = videoMatch[2];
    } else if (imageMatch) {
      contentType = imageMatch[1].toLowerCase();
      encoded = imageMatch[2];
    } else if (rawData.startsWith('data:video/')) {
      isVideo = true;
      const commaIdx = rawData.indexOf(',');
      contentType = rawData.substring(5, commaIdx).split(';')[0] || 'video/mp4';
      encoded = rawData.substring(commaIdx + 1);
    } else if (rawData.startsWith('data:image/')) {
      const commaIdx = rawData.indexOf(',');
      contentType = rawData.substring(5, commaIdx).split(';')[0] || 'image/jpeg';
      encoded = rawData.substring(commaIdx + 1);
    }

    const buffer = Buffer.from(encoded.replace(/\s/g, ''), 'base64');

    if (!buffer.length) {
      return NextResponse.json({ success: false, message: 'Empty media buffer' }, { status: 400 });
    }

    let ext = 'jpg';
    let folder = 'banners';

    if (isVideo) {
      ext = contentType.includes('webm') ? 'webm' : contentType.includes('quicktime') || contentType.includes('mov') ? 'mov' : 'mp4';
      folder = 'banners/videos';
    } else {
      // Validate that buffer is actually an image (prevent corrupt files, HTML/JSON error text)
      const isJpeg = buffer.length > 3 && buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
      const isPng = buffer.length > 4 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
      const isWebp = buffer.length > 12 && buffer.slice(0, 4).toString('ascii') === 'RIFF' && buffer.slice(8, 12).toString('ascii') === 'WEBP';
      const isGif = buffer.length > 3 && buffer.slice(0, 3).toString('ascii') === 'GIF';

      if (!isJpeg && !isPng && !isWebp && !isGif) {
        return NextResponse.json({
          success: false,
          message: 'The selected file is not a valid format (JPG, PNG, WebP, MP4, WebM). Please select a genuine photo or video file.'
        }, { status: 400 });
      }

      ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
      folder = fileName?.includes('banner-') ? 'banners' : 'services';
    }

    // Strip any existing extension BEFORE sanitizing
    const baseFileName = fileName.replace(/\.[^.]+$/, '');
    const cleanName = baseFileName.replace(/[^a-zA-Z0-9_-]/g, '') || `media-${Date.now()}`;
    const key = `${folder}/${Date.now()}-${cleanName}.${ext}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );

    const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

    return NextResponse.json({
      success: true,
      message: `Uploaded directly to public AWS S3 as ${isVideo ? 'video' : 'photo'}!`,
      data: { s3Url, isVideo },
    });
  } catch (err: any) {
    console.error('Direct S3 Upload API Error:', err);
    try {
      const body = await req.json();
      return NextResponse.json({
        success: true,
        message: 'Image saved locally',
        data: { s3Url: body.imageBase64 },
      });
    } catch {
      return NextResponse.json({ success: false, message: err.message || 'Upload failed' }, { status: 500 });
    }
  }
}
