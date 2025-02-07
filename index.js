// Example usage
const { getInstagramData } = require('./src/index.js');

if (require.main === module) {
  (async () => {
    // change this to your username
    const USERNAME = 'irwinpratajaya';
    const data = await getInstagramData(USERNAME);
    if (data.images.length > 0) {
      console.log('profile:', data.profile);
      console.log('images:', data.images.slice(0, 3));
      return data;
    } else {
      console.log('No images found. The profile might be private or Instagram might have changed their structure.');
      console.log('Make sure to update the Cookie header with valid Instagram cookies.');
    }
  })();
}