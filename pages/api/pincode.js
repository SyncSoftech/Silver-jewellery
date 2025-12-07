// // pages/api/pincode.js

// export default async function handler(req, res) {
//   try {
//     const { pincode } = req.query;

//     if (!pincode) {
//       return res.status(400).json({
//         error: "Pincode is required → /api/pincode?pincode=110003",
//       });
//     }

//     const url = `https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pincode}`;

//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         Authorization: "Token c6b5b055b24e04b10e21f3fb9b4fcc52c24c7616",
//       },
//     });

//     if (!response.ok) {
//       return res.status(response.status).json({
//         error: "Failed to fetch from Delhivery",
//         status: response.status,
//       });
//     }

//     const data = await response.json();

//     return res.status(200).json(data);
//   } catch (err) {
//     console.error("Delhivery Production Error:", err);
//     return res.status(500).json({
//       error: "Internal server error",
//     });
//   }
// }



// pages/api/pincode.js

export default async function handler(req, res) {
  try {
    const { pincode } = req.query;

    if (!pincode) {
      return res.status(400).json({
        error: "Pincode is required → /api/pincode?pincode=110003",
      });
    }

    const API_KEY = process.env.DELHIVERY_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({
        error: "Delhivery API key missing. Please set DELHIVERY_API_KEY in .env",
      });
    }

    const url = `https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pincode}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Token ${API_KEY}`,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Failed to fetch from Delhivery",
        status: response.status,
      });
    }

    const data = await response.json();

    return res.status(200).json(data);
  } catch (err) {
    console.error("Delhivery Production Error:", err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
