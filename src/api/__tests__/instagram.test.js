const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const { createHeaders, getUserInfo, fetchUserPosts, extractImageUrl } = require('../instagram');
const { ENDPOINTS } = require('../../constants/instagram');

const mock = new MockAdapter(axios);

describe('Instagram API Module', () => {
  const mockUsername = 'testuser';
  const mockCookie = 'csrftoken=abc123; sessionid=xyz789; ds_user_id=12345';
  const mockUserId = '12345';

  beforeEach(() => {
    mock.reset();
  });

  describe('createHeaders', () => {
    it('should create valid headers with CSRF token', () => {
      const headers = createHeaders(mockUsername, mockCookie);
      expect(headers['X-CSRFToken']).toBe('abc123');
      expect(headers.Cookie).toBe(mockCookie);
      expect(headers.Referer).toBe(`https://www.instagram.com/${mockUsername}/`);
    });

    it('should handle missing CSRF token', () => {
      const cookieWithoutCsrf = 'sessionid=xyz789; ds_user_id=12345';
      const headers = createHeaders(mockUsername, cookieWithoutCsrf);
      expect(headers['X-CSRFToken']).toBe('');
      expect(headers.Cookie).toBe(cookieWithoutCsrf);
    });
  });

  describe('getUserInfo', () => {
    const mockUserData = {
      data: {
        user: {
          id: mockUserId,
          username: mockUsername,
          full_name: 'Test User',
          biography: 'Test bio',
          edge_followed_by: { count: 100 },
          edge_follow: { count: 200 },
          is_private: false,
          is_verified: true,
          profile_pic_url_hd: 'https://example.com/pic.jpg'
        }
      }
    };

    it('should fetch and transform user info correctly', async () => {
      mock.onGet(`${ENDPOINTS.USER_INFO}?username=${mockUsername}`)
        .reply(200, mockUserData);

      const headers = createHeaders(mockUsername, mockCookie);
      const userInfo = await getUserInfo(mockUsername, headers);

      expect(userInfo.id).toBe(mockUserId);
      expect(userInfo.username).toBe(mockUsername);
      expect(userInfo.followersCount).toBe(100);
      expect(userInfo.followingCount).toBe(200);
      expect(userInfo.profilePicUrl).toBeValidUrl();
    });

    it('should throw error when user data is not available', async () => {
      mock.onGet(`${ENDPOINTS.USER_INFO}?username=${mockUsername}`)
        .reply(200, { data: {} });

      const headers = createHeaders(mockUsername, mockCookie);
      await expect(getUserInfo(mockUsername, headers))
        .rejects.toThrow('Failed to fetch user information');
    });
  });

  describe('fetchUserPosts', () => {
    const mockPosts = {
      items: [
        {
          image_versions2: {
            candidates: [{ url: 'https://example.com/image1.jpg' }]
          }
        },
        {
          carousel_media: [
            {
              image_versions2: {
                candidates: [{ url: 'https://example.com/image2.jpg' }]
              }
            }
          ]
        }
      ]
    };

    it('should fetch and extract image URLs correctly', async () => {
      mock.onGet(`${ENDPOINTS.USER_FEED}${mockUserId}/`)
        .reply(200, mockPosts);

      const headers = createHeaders(mockUsername, mockCookie);
      const images = await fetchUserPosts(mockUserId, headers);

      expect(images).toHaveLength(2);
      expect(images[0]).toBeValidUrl();
      expect(images[1]).toBeValidUrl();
    });

    it('should throw error when feed data is not available', async () => {
      mock.onGet(`${ENDPOINTS.USER_FEED}${mockUserId}/`)
        .reply(200, {});

      const headers = createHeaders(mockUsername, mockCookie);
      await expect(fetchUserPosts(mockUserId, headers))
        .rejects.toThrow('Failed to fetch user feed');
    });
  });

  describe('extractImageUrl', () => {
    it('should extract URLs from carousel media', () => {
      const post = {
        carousel_media: [
          {
            image_versions2: {
              candidates: [{ url: 'https://example.com/image1.jpg' }]
            }
          },
          {
            image_versions2: {
              candidates: [{ url: 'https://example.com/image2.jpg' }]
            }
          }
        ]
      };

      const urls = extractImageUrl(post);
      expect(urls).toHaveLength(2);
      expect(urls[0]).toBe('https://example.com/image1.jpg');
      expect(urls[1]).toBe('https://example.com/image2.jpg');
    });

    it('should handle carousel media without valid images', () => {
      const post = {
        carousel_media: [
          { image_versions2: null },
          { image_versions2: { candidates: [] } },
          {}
        ]
      };

      const urls = extractImageUrl(post);
      expect(urls).toHaveLength(0);
    });

    it('should extract URL from single image post', () => {
      const post = {
        image_versions2: {
          candidates: [{ url: 'https://example.com/single.jpg' }]
        }
      };

      const urls = extractImageUrl(post);
      expect(urls).toHaveLength(1);
      expect(urls[0]).toBe('https://example.com/single.jpg');
    });

    it('should handle post without valid images', () => {
      const post = {
        image_versions2: null
      };

      const urls = extractImageUrl(post);
      expect(urls).toHaveLength(0);
    });

    it('should handle carousel media with missing candidates array', () => {
      const post = {
        carousel_media: [
          {
            image_versions2: {
              candidates: [{ url: 'https://example.com/image1.jpg' }]
            }
          },
          {
            image_versions2: {
              candidates: null
            }
          },
          {
            image_versions2: {
              candidates: []
            }
          }
        ]
      };

      const urls = extractImageUrl(post);
      expect(urls).toHaveLength(1);
      expect(urls[0]).toBe('https://example.com/image1.jpg');
    });

    it('should handle carousel media with missing image_versions2', () => {
      const post = {
        carousel_media: [
          {
            image_versions2: null
          },
          {}
        ]
      };

      const urls = extractImageUrl(post);
      expect(urls).toHaveLength(0);
    });

    it('should handle post with missing candidates array', () => {
      const post = {
        image_versions2: {
          candidates: null
        }
      };

      const urls = extractImageUrl(post);
      expect(urls).toHaveLength(0);
    });
  });
});