// Example usage
const { getInstagramImages } = require('./src/index.js');

if (require.main === module) {
  (async () => {
    // change this to your username
    const USERNAME = 'irwinpratajaya';
    const images = await getInstagramImages(USERNAME);
    if (images.length > 0) {
      console.log('Found Images:', images.length);
      console.log('First few URLs:', images.slice(0, 3));
      return images;
    } else {
      console.log('No images found. The profile might be private or Instagram might have changed their structure.');
      console.log('Make sure to update the Cookie header with valid Instagram cookies.');
    }
  })();
}