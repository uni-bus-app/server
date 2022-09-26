import { getAuth } from 'firebase-admin/auth';

const verifyIdToken = async (idToken: string) => {
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    // ...
  } catch (error) {
    // Handle error
  }
};

export default {};
