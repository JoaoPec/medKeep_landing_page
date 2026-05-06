import { nanoid } from 'nanoid';
import { createHash } from 'crypto';

export const generateSeed = () => {
  const secret: string = nanoid();
  return createHash('sha256').update(secret).digest('hex');
};
