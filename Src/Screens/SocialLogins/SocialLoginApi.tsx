// import axios from 'axios';
// import { baseUrlV1, socialLogin } from '../../Constants/ApiUrls';

// const socialLoginApi = async ({socialLoginId, socialLoginType, deviceType, deviceToken, deviceId}:any) => {
//   try {
//     const data = JSON.stringify({
//       social_login_id: socialLoginId,
//       social_login_type: socialLoginType,
//       device_type: deviceType,
//       device_token: deviceToken,
//       device_id: deviceId,
//     });

//     const config = {
//       method: 'post',
//       maxBodyLength: Infinity,
//       url: baseUrlV1 + socialLogin,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       data,
//     };

//     const response = await axios.request(config);
//     return response.data;
//   } catch (error) {
//     console.error('Social login error:', error);
//     throw error;
//   }
// };

// export default socialLoginApi;
