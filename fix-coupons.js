// scripts/fix-coupons.js
// Usage:
//   DRY RUN:   node scripts/fix-coupons.js --dry
//   APPLY:     node scripts/fix-coupons.js
// Optional: set MONGO_URI env var or ensure it's in your .env (this script uses process.env.MONGO_URI)

const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const DRY_RUN = process.argv.includes('--dry') || process.argv.includes('-d');

async function main() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('ERROR: MONGO_URI environment variable not set. Set it and re-run.');
    process.exit(1);
  }

  // Adjust require path if your models folder is located elsewhere.
  // This assumes models/Coupon.js export is `module.exports = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);`
  const Coupon = require('./models/Coupon');

  console.log(`[${new Date().toISOString()}] Connecting to MongoDB...`);
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  try {
    // Find coupons that have applyToAll true but have product/category restrictions populated
    const query = {
      applyToAll: true,
      $or: [
        { applicableProducts: { $exists: true, $not: { $size: 0 } } },
        { applicableCategories: { $exists: true, $not: { $size: 0 } } }
      ]
    };

    console.log('Querying for affected coupons...');
    const affected = await Coupon.find(query).lean();

    if (!affected || affected.length === 0) {
      console.log('No coupons found that match: applyToAll=true AND (applicableProducts or applicableCategories non-empty). Nothing to do.');
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log(`Found ${affected.length} affected coupon(s). Creating backup file...`);

    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilename = path.resolve(process.cwd(), `coupon-backup-${ts}.json`);
    fs.writeFileSync(backupFilename, JSON.stringify(affected, null, 2), 'utf8');
    console.log(`Backup written to ${backupFilename}`);

    console.log('');
    console.log('Sample affected coupons (first 5):');
    affected.slice(0, 5).forEach((c, i) => {
      console.log(`${i + 1}. id=${c._id} code=${c.code} applyToAll=${c.applyToAll} applicableProducts=${(c.applicableProducts || []).length} applicableCategories=${(c.applicableCategories || []).length}`);
    });
    console.log('');

    if (DRY_RUN) {
      console.log('Dry run mode enabled (--dry). No changes will be made. Exiting.');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Confirm (extra safety) — require --yes flag to actually perform change
    const requireYes = !process.argv.includes('--yes') && !process.argv.includes('-y');
    if (requireYes) {
      console.log('To actually apply the changes, re-run with --yes flag:');
      console.log('  node scripts/fix-coupons.js --yes');
      console.log('Or run with both --yes and --dry to double-check: --dry --yes');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Perform update: set applyToAll=false for those coupon ids
    const ids = affected.map(c => c._id);
    console.log(`Updating ${ids.length} coupon(s): setting applyToAll=false ...`);

    const result = await Coupon.updateMany(
      { _id: { $in: ids } },
      { $set: { applyToAll: false } }
    );

    console.log('Update result:', result && result.nModified !== undefined ? `${result.nModified} modified` : result);
    console.log('Done. Verify in your admin panel or DB that coupons now have applyToAll=false.');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(1);
  }
}

main();
