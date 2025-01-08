import { verifyToken } from '../_utils/auth.js';
import Users from '../_services/Users.js';

export const getUser = async (req) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;

  const token = authHeader.replace('Bearer ', '');
  const decoded = verifyToken(token);
  if (!decoded) return null;

  return Users.find({ id: decoded.id });
};
