interface ChunkData {
  blob: Blob;
  index: number;
  totalChunks: number;
  sessionId: string;
}

export async function uploadChunk({ blob, index, totalChunks, sessionId }: ChunkData): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append('chunk', blob);
    formData.append('index', index.toString());
    formData.append('totalChunks', totalChunks.toString());
    formData.append('sessionId', sessionId);

    const response = await fetch('/api/upload-chunk', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Chunk upload error:', error);
    return false;
  }
}

export function createChunks(audioBlob: Blob, chunkDuration: number = 15): Blob[] {
  const chunks: Blob[] = [];
  const totalDuration = audioBlob.size / (44100 * 4); // Assuming 44.1kHz, 32-bit float
  const chunkSize = (chunkDuration * 44100 * 4);
  
  for (let i = 0; i < audioBlob.size; i += chunkSize) {
    chunks.push(audioBlob.slice(i, i + chunkSize));
  }
  
  return chunks;
} 