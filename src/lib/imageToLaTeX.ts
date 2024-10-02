import axios from 'axios';

const appId = process.env.MATHPIX_APP_ID;
const apiKey = process.env.MATHPIX_API_KEY;

export async function imageToLaTeX(imageBase64: string): Promise<string> {
  if (!apiKey || !appId) {
    throw new Error('Mathpix API key or App ID not found in environment variables');
  }

  try {
    const response = await axios.post<any>(
      'https://api.mathpix.com/v3/text',
      {
        src: `data:image/jpeg;base64,${imageBase64}`,
        formats: ['text', 'data'],
        data_options: {
          include_latex: true,
          include_asciimath: false,
        },
        rm_spaces: true
      },
      {
        headers: {
          'app_id': appId,
          'app_key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(response.data);
    return
  } catch (error) {
    console.error('Error converting image to LaTeX:', error);
    throw error;
  }
}