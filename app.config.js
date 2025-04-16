import 'dotenv/config';

export default {
  expo: {
    // ...existing config...
    extra: {
      appwriteEndpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      cartCollectionId: process.env.EXPO_PUBLIC_DATABASE_CART_COLLECTION_ID,
    },
  },
};
