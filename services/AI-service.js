import axios from 'axios';

export const analyzeImage = async (base64ImageData) => {
  try {
    if (!base64ImageData) {
      throw new Error('Please provide an image to analyze');
    }

    const apiKey = 'AIzaSyBBhze4BvdIlKKYPGaTsxjZCK9-lE69vvA'; // Replace <YOUR_API_KEY> with your actual key or use dotenv for environment management
    const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const reqData = {
      requests: [
        {
          image: {
            content: base64ImageData,
          },
          features: [{ type: 'LABEL_DETECTION', maxResults: 5 }],
        },
      ],
    };

    const apiResponse = await axios.post(apiURL, reqData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Checking if labelAnnotations exist before accessing
    if (apiResponse.data.responses[0] && apiResponse.data.responses[0].labelAnnotations) {
      return apiResponse.data.responses[0].labelAnnotations;
    } else {
      throw new Error('No labels found in the image');
    }
  } catch (error) {
    console.log('Error analyzing image: ', error.response ? error.response.data : error.message);
    throw new Error(error.response ? error.response.data.error.message : error.message);
  }
};
