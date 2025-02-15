# Instagram Image Crawler

A Node.js script to fetch profile information and images from public Instagram profiles using Instagram's internal API. This tool allows you to retrieve profile details (including follower count, following count, and total posts) along with image URLs from a user's recent posts, including both single images and carousel posts.

## Features

- Fetch comprehensive profile information (followers, following, posts count, etc.)
- Retrieve recent posts from any public Instagram profile
- Support for both single image posts and carousel posts
- Comprehensive error handling with detailed error messages
- Environment variable configuration for secure credential management

## Prerequisites

- Node.js (v12 or higher)
- Instagram account cookies (for authentication)

## Installation

1. Clone the repository:
   ```bash
   git clone [your-repo-url]
   cd instagram-image-crawler
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Follow the instructions in `.env.example` to add your Instagram cookies

## Usage

```javascript
const { getInstagramData } = require('./index');

// Example usage
async function main() {
  const data = await getInstagramData('username');
  console.log('Profile Info:', data.profile);
  console.log('Found Images:', data.images.length);
  console.log('Image URLs:', data.images);
}

main().catch(console.error);
```

## Error Handling

The script handles various error scenarios:
- Rate limiting (429)
- Authentication errors (401)
- Profile not found (404)
- Invalid responses

## Disclaimer

This tool is for educational purposes only. Make sure to comply with Instagram's terms of service and API usage guidelines when using this script.