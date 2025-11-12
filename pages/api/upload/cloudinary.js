// pages/api/upload/cloudinary.js
import formidable from 'formidable';
import cloudinary from 'cloudinary';
import fs from 'fs';

// configure Cloudinary from env vars
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export const config = { api: { bodyParser: false } };

// parseForm for modern formidable (v2+)
function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true }); // allow arrays
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { fields, files } = await parseForm(req);

    // Debug (remove in production)
    console.log('files keys:', Object.keys(files || {}));

    // Accept 'image' or 'file' or fallback to first value
    let candidate = files?.image ?? files?.file ?? Object.values(files || {})[0];

    // If candidate is an array (formidable returns arrays when multiples true),
    // take the first file object.
    const file = Array.isArray(candidate) ? candidate[0] : candidate;

    if (!file) {
      console.error('No file object found in parsed files:', files);
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Support common filepath properties across versions
    const filepath = file.filepath || file.path || file.tempFilePath || file.file;

    // If a temp file path exists on disk, upload using it
    if (filepath && fs.existsSync(filepath)) {
      try {
       const result = await cloudinary.v2.uploader.upload(filepath, {
  folder: 'products',
  resource_type: 'image',
  transformation: [
    { crop: 'limit', width: 800, height: 800 },
    { quality: 'auto' }
  ]
});


        // cleanup temp file
        try { fs.unlinkSync(filepath); } catch (e) { /* ignore */ }

        return res.status(200).json({
          success: true,
          url: result.secure_url,
          public_id: result.public_id,
          raw: result
        });
      } catch (err) {
        console.error('cloudinary upload (path) error:', err);
        try { fs.unlinkSync(filepath); } catch (e) { /* ignore */ }
        return res.status(500).json({ error: 'Cloudinary upload failed', details: err.message });
      }
    }

    // If no filepath, but a buffer exists, upload via upload_stream
    const buffer = file.buffer || (file.toBuffer ? await file.toBuffer() : null);

    if (buffer) {
      try {
        const uploadPromise = new Promise((resolve, reject) => {
          const stream = cloudinary.v2.uploader.upload_stream(
            {
              folder: 'products',
              resource_type: 'image',
              transformation: 'c_limit,w_800,h_800/q_auto'
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(buffer);
        });

        const result = await uploadPromise;
        return res.status(200).json({ success: true, url: result.secure_url, public_id: result.public_id });
      } catch (err) {
        console.error('upload_stream error:', err);
        return res.status(500).json({ error: 'Cloudinary stream upload failed', details: err.message });
      }
    }

    // If we get here, we couldn't find a usable file
    console.error('Unable to locate an uploadable file object. Files:', files);
    return res.status(400).json({ error: 'Missing required parameter - file' });

  } catch (err) {
    console.error('Upload handler top-level error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
