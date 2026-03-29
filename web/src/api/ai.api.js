import api from './axios';

export const askAI = async (prompt, language) => {
    // We use the base axios instance which already has the relative /api/v1 prefix
    // So we just append /ai/ask
    return api.post('/ai/ask', { prompt, language });
};
