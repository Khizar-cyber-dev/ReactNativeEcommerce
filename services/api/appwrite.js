import { Client, Databases, Account, Storage, Avatars, ID, Query } from 'appwrite';

const client = new Client();
client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_PROJECT_ID);

const databases = new Databases(client);
const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);

export async function createUser({ name, email, password }) {
  try {
    const user = await account.create(ID.unique(), email, password, name);
    await databases.createDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_USERS_COLLECTION_ID,
      ID.unique(),
      {
        name: name,
        email: email,
        userId: user.$id
      }
    );
    return user;
  } catch (e) {
    console.log('Signup Error:', e);
    throw e;
  }
}

export async function loginUser(email, password) {
  try {
    return await account.createEmailSession(email, password);
  } catch (e) {
    console.log('Login Error:', e);
    throw e;
  }
}

export async function getCurrentUser() {
  try {
    return await account.get();
  } catch (e) {
    console.log('Get User Error:', e);
    return null;
  }
}

export async function logoutUser() {
  try {
    await account.deleteSession('current');
  } catch (e) {
    console.log('Logout Error:', e);
  }
}

export async function createProduct(productData) {
  try {
    return await databases.createDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_PRODUCTS_COLLECTION_ID,
      ID.unique(),
      productData
    );
  } catch (e) {
    console.log('Create Product Error:', e);
    throw e;
  }
}

export async function getProducts() {
  try {
    const result = await databases.listDocuments(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_PRODUCTS_COLLECTION_ID
    );
    return result.documents;
  } catch (e) {
    console.log('Get Products Error:', e);
    throw e;
  }
}

export async function deleteProduct(productId) {
  try {
    await databases.deleteDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_PRODUCTS_COLLECTION_ID,
      productId
    );
  } catch (e) {
    console.log('Delete Product Error:', e);
    throw e;
  }
}

export async function uploadImage(file) {
  try {
    const uploadedFile = await storage.createFile(
      process.env.EXPO_PUBLIC_BUCKET_ID,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (e) {
    console.log('Upload Image Error:', e);
    throw e;
  }
}

export function getImageUrl(fileId) {
  return storage.getFilePreview(
    process.env.EXPO_PUBLIC_BUCKET_ID,
    fileId
  ).href;
}

export async function socialLogin(provider) {
  try {
    await account.createOAuth2Session(
      provider, 
      'appwrite://auth/callback', 
      'appwrite://auth/callback' 
    );
  } catch (e) {
    console.log(`OAuth Login Error [${provider}]:`, e);
    throw e;
  }
}

export { client, databases, account, storage, avatars };