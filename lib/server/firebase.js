import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function getFirebaseAuth() {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Firebase Admin environment variables are not configured.");
    }

    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId,
    });
  }

  return getAuth();
}

export async function requireFirebaseUser(req, res) {
  const authorization = req.headers.authorization || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    res.status(401).json({ error: "Sign in to continue." });
    return null;
  }

  try {
    const decoded = await getFirebaseAuth().verifyIdToken(match[1]);
    return {
      uid: decoded.uid,
      email: decoded.email || null,
      emailVerified: Boolean(decoded.email_verified),
      name: decoded.name || null,
    };
  } catch (error) {
    console.warn("Firebase ID-token verification failed.", error?.code || "unknown");
    res.status(401).json({ error: "Your session is invalid or expired. Please sign in again." });
    return null;
  }
}
