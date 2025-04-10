import { customFetchAPI } from '@/shared/api';

const getPocketAnalysis = () => customFetchAPI({ url: '/pockets/analysis', method: 'GET' });

export default getPocketAnalysis;
