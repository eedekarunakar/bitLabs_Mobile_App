export const API_LOGO_URL = 'https://bitlabs-web-application.onrender.com/image/getImage/bitLabLogo';

export const fetchLogoFromAPI = async (userToken: string | null) => {

    const response = await fetch(API_LOGO_URL, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${userToken}`,
    },
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const blob = await response.blob();
  const reader = new FileReader();

  return new Promise<string>((resolve, reject) => {
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject('Failed to convert blob to base64');
    reader.readAsDataURL(blob);
  });
};
