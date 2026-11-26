import mongoose from "mongoose";

export default async function seedCatalog(Model, entries) {
  const uri = process.env.MONGO_URI;
  const reset = process.argv.includes("--reset");

  if (!uri || process.env.NODE_ENV === "production") {
    throw new Error("Seed scripts require a development MONGO_URI.");
  }

  // Require a standalone local development database before clearing a collection.
  const localDevelopmentUri = /^mongodb:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/[a-zA-Z0-9_-]+_(dev|test)$/;
  if (reset && !localDevelopmentUri.test(uri)) {
    throw new Error("Reset requires a local database with a name ending in _dev or _test.");
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    if (reset) await Model.deleteMany({});
    const now = new Date();
    const timestamps = Model.schema.options.timestamps ? { createdAt: now, updatedAt: now } : {};
    await Model.bulkWrite(entries.map((entry) => ({
      updateOne: {
        filter: { name: entry.name },
        update: { $setOnInsert: { ...timestamps, ...entry } },
        upsert: true,
        timestamps: false,
      },
    })));
    console.log(`Seeded ${Model.modelName} data.`);
  } finally {
    await mongoose.disconnect();
  }
}
