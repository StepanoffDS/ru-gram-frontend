import { API_URL } from '../constants/api.constants';

interface UploadMessageImageResponse {
  imageUrl: string;
}

export async function uploadMessageImage(
  chatId: string,
  file: File,
): Promise<UploadMessageImageResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/chats/${chatId}/images`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || 'Failed to upload image');
  }

  return response.json();
}
