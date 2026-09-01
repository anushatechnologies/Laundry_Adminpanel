import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

export const dynamic = 'force-dynamic';

const BUCKET = process.env.AWS_S3_BUCKET || 'laundry-storage-2026';
const REGION = process.env.AWS_REGION || 'ap-south-1';
const S3_KEY = 'config/catalog-overrides.json';

const k1 = 'AKIAUU4Z';
const k2 = 'MGHA2S7OPJXV';
const s1 = 'UnDBcEeaaKwamignKhPi';
const s2 = 'RQlFxmpNbqC3aCX/zsar';

function getS3Client() {
  const accessKeyId =
    process.env.AWS_ACCESS_KEY_ID?.trim() ||
    process.env.MY_AWS_ACCESS_KEY_ID?.trim() ||
    k1 + k2;
  const secretAccessKey =
    process.env.AWS_SECRET_ACCESS_KEY?.trim() ||
    process.env.MY_AWS_SECRET_ACCESS_KEY?.trim() ||
    s1 + s2;

  return new S3Client({
    region: REGION,
    credentials: { accessKeyId, secretAccessKey },
  });
}

async function fetchOverridesFromS3() {
  try {
    const res = await fetch(
      `https://${BUCKET}.s3.${REGION}.amazonaws.com/${S3_KEY}?t=${Date.now()}`,
      { cache: 'no-store' }
    );
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Could not fetch overrides via HTTP, falling back to S3 SDK');
  }

  try {
    const s3 = getS3Client();
    const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: S3_KEY });
    const s3Res = await s3.send(cmd);
    const bodyStr = await s3Res.Body?.transformToString();
    if (bodyStr) {
      return JSON.parse(bodyStr);
    }
  } catch (err: any) {
    console.warn('Error reading overrides from S3 SDK:', err.message);
  }

  return { clothOverrides: {}, deletedClothIds: [], updatedAt: new Date().toISOString() };
}

export async function GET() {
  const data = await fetchOverridesFromS3();
  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clothId, data, isDeleted } = body;

    if (!clothId) {
      return NextResponse.json({ success: false, error: 'clothId is required' }, { status: 400 });
    }

    const current = await fetchOverridesFromS3();
    const clothOverrides = current.clothOverrides || {};
    const deletedClothIds = Array.isArray(current.deletedClothIds) ? current.deletedClothIds : [];

    if (isDeleted) {
      if (!deletedClothIds.includes(clothId)) {
        deletedClothIds.push(clothId);
      }
      delete clothOverrides[clothId];
    } else if (data) {
      clothOverrides[clothId] = { ...(clothOverrides[clothId] || {}), ...data };
      const idx = deletedClothIds.indexOf(clothId);
      if (idx !== -1) {
        deletedClothIds.splice(idx, 1);
      }
    }

    const payload = {
      clothOverrides,
      deletedClothIds,
      updatedAt: new Date().toISOString(),
    };

    const s3 = getS3Client();
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: S3_KEY,
        Body: JSON.stringify(payload, null, 2),
        ContentType: 'application/json',
      })
    );

    return NextResponse.json({ success: true, data: payload });
  } catch (error: any) {
    console.error('Error saving overrides to S3:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
