import {
  Client,
  Databases,
  Account,
  Storage,
  Avatars,
  ID,
  Query,
  Permission,
  Role,
} from 'appwrite';

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
      process.env.EXPO_PUBLIC_PROJECT_DATABASE_ID,
      process.env.EXPO_PUBLIC_DATABASE_USERS_COLLECTION_ID,
      user.$id,
      {
        name,
        email,
        userId: user.$id,
      }
    );

    return user;
  } catch (e) {
    console.error('Signup Error:', e);
    throw e;
  }
}

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
    console.error('Login Error:', e);
    throw e;
  }
}

export async function getCurrentUser() {
  try {
    return await account.get();
  } catch (e) {
    console.error('Get User Error:', e);
    return null;
  }
}

export async function logoutUser() {
  try {
    await account.deleteSession('current');
  } catch (e) {
    console.error('Logout Error:', e);
  }
}

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
    console.error('Create Product Error:', e);
    throw e;
  }
}

export async function getCart(userId) {
  try {
    const result = await databases.listDocuments(
      process.env.EXPO_PUBLIC_PROJECT_DATABASE_ID,
      process.env.EXPO_PUBLIC_DATABASE_PRODUCTS_COLLECTION_ID,
      [Query.equal('userId', userId)]
    );
    return result.documents;
  } catch (e) {
    console.error('Get Cart Error:', e);
    throw e;
  }
}

export async function updateProductQuantity(userId, productId, quantity) {
  try {
    return await databases.updateDocument(
      process.env.EXPO_PUBLIC_PROJECT_DATABASE_ID,
      process.env.EXPO_PUBLIC_DATABASE_PRODUCTS_COLLECTION_ID,
      productId,
      { quantity },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
      ]
    );
  } catch (e) {
    console.error('Update Product Quantity Error:', e);
    throw e;
  }
}

export async function deleteProduct(userId, productId) {
  try {
    await databases.deleteDocument(
      process.env.EXPO_PUBLIC_PROJECT_DATABASE_ID,
      process.env.EXPO_PUBLIC_DATABASE_PRODUCTS_COLLECTION_ID,
      productId
    );
  } catch (e) {
    console.error('Delete Product Error:', e);
    throw e;
  }
}

export async function getProducts() {
  try {
    const result = await databases.listDocuments(
      process.env.EXPO_PUBLIC_PROJECT_DATABASE_ID,
      process.env.EXPO_PUBLIC_DATABASE_PRODUCTS_COLLECTION_ID
    );
    return result.documents;
  } catch (e) {
    console.error('Get Products Error:', e);
    throw e;
  }
}

export async function socialLogin(provider) {
  try {
    await account.createOAuth2Session(
      provider,
      'appwrite://auth/callback',
      'appwrite://auth/callback'
    );
  } catch (e) {
    console.error(`OAuth Login Error [${provider}]:`, e);
    throw e;
  }
}

export { client, databases, account, storage, avatars };
