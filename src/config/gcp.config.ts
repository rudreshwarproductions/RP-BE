import { registerAs } from '@nestjs/config';

export default registerAs('gcp', () => ({
  bucket: process.env.GCP_BUCKET || 'rp_files',
}));
