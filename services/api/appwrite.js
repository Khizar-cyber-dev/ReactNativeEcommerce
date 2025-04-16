import { Client, Databases, Account, Storage, Avatars, ID, Query, Permission, Role } from 'appwrite';

const client = new Client();
client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_PROJECT_ID);

const databases = new Databases(client);
const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);

// User functions
export async function createUser({ name, email, password }) {
  try {
    const user = await account.create(ID.unique(), email, password, name);
    await databases.createDocument(
      process.env.EXPO_PUBLIC_PROJECT_DATABASE_ID,
      process.env.EXPO_PUBLIC_DATABASE_USERS_COLLECTION_ID,
      user.$id,
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

// Login function
export async function loginUser(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    const user = await account.get();

    const existingUser = await databases.listDocuments(
      process.env.EXPO_PUBLIC_PROJECT_DATABASE_ID,
      process.env.EXPO_PUBLIC_DATABASE_USERS_COLLECTION_ID,
      [Query.equal('userId', user.$id)]
    );

    if (existingUser.documents.length === 0) {
      await databases.createDocument(
        process.env.EXPO_PUBLIC_PROJECT_DATABASE_ID,
        process.env.EXPO_PUBLIC_DATABASE_USERS_COLLECTION_ID,
        user.$id, 
        {
          name: user.name,
          email: user.email,
          userId: user.$id,
        }
      );
    }

    return session;
  } catch (e) {
    console.log('Login Error:', e);
    throw e;
  }
}

// Get current user function
export async function getCurrentUser() {
  try {
    return await account.get();
  } catch (e) {
    console.log('Get User Error:', e);
    return null;
  }
}

// LogOut user function
export async function logoutUser() {
  try {
    await account.deleteSession('current');
  } catch (e) {
    console.log('Logout Error:', e);
  }
}

// Create Product function
export async function createProduct(productData) {
  try {
    return await databases.createDocument(
      process.env.EXPO_PUBLIC_PROJECT_DATABASE_ID, 
      process.env.EXPO_PUBLIC_DATABASE_PRODUCTS_COLLECTION_ID,
      ID.unique(),
      productData,
      [
        Permission.read(Role.user(productData.userId)), 
        Permission.update(Role.user(productData.userId)), 
        Permission.delete(Role.user(productData.userId)), 
      ]
    );
  } catch (e) {
    console.log('Create Product Error:', e);
    throw e;
  }
}

// Cart functions
export async function getCart(userId) {
  try {
    const productsCollectionId = process.env.EXPO_PUBLIC_DATABASE_PRODUCTS_COLLECTION_ID;
    if (!productsCollectionId) {
      throw new Error('Missing environment variable: EXPO_PUBLIC_DATABASE_PRODUCTS_COLLECTION_ID');
    }
    const result = await databases.listDocuments(
      process.env.EXPO_PUBLIC_PROJECT_DATABASE_ID,
      productsCollectionId,
      [Query.equal('userId', userId)] 
    );
    console.log('Fetched cart data (products):', result.documents); 
    return result.documents; 
  } catch (e) {
    console.log('Get Cart Error:', e);
    throw e;
  }
}

export async function updateProductQuantity(userId, productId, quantity) {
  try {
    const productsCollectionId = process.env.EXPO_PUBLIC_DATABASE_PRODUCTS_COLLECTION_ID;
    if (!productsCollectionId) {
      throw new Error('Missing environment variable: EXPO_PUBLIC_DATABASE_PRODUCTS_COLLECTION_ID');
    }

    return await databases.updateDocument(
      process.env.EXPO_PUBLIC_PROJECT_DATABASE_ID,
      productsCollectionId,
      productId,
      { quantity },
      [Query.equal('userId', userId)] 
    );
  } catch (e) {
    console.log('Update Product Quantity Error:', e);
    throw e;
  }
}

// Delete a product for a specific user
export async function deleteProduct(userId, productId) {
  try {
    const productsCollectionId = process.env.EXPO_PUBLIC_DATABASE_PRODUCTS_COLLECTION_ID;
    if (!productsCollectionId) {
      throw new Error('Missing environment variable: EXPO_PUBLIC_DATABASE_PRODUCTS_COLLECTION_ID');
    }

    await databases.deleteDocument(
      process.env.EXPO_PUBLIC_PROJECT_DATABASE_ID,
      productsCollectionId,
      productId
    );
  } catch (e) {
    console.log('Delete Product Error:', e);
    throw e;
  }
}

// Product functions
export async function getProducts() {
  try {
    const result = await databases.listDocuments(
      process.env.EXPO_PUBLIC_PROJECT_DATABASE_ID,
      process.env.EXPO_PUBLIC_DATABASE_PRODUCTS_COLLECTION_ID
    );
    return result.documents;
  } catch (e) {
    console.log('Get Products Error:', e);
    throw e;
  }
}

// Get a single product by ID
export async function getProductById(productId) {
  try {
    return await databases.getDocument(
      process.env.EXPO_PUBLIC_PROJECT_DATABASE_ID,
      process.env.EXPO_PUBLIC_DATABASE_PRODUCTS_COLLECTION_ID,
      productId
    );
  } catch (e) {
    console.log('Get Product Error:', e);
    throw e;
  }
}

// Image functions
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

// Get image URL
export function getImageUrl(fileId) {
  return storage.getFilePreview(
    process.env.EXPO_PUBLIC_BUCKET_ID,
    fileId
  ).href;
}

// Social login
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