const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const { getUserId } = require('../instagram');
const { ENDPOINTS } = require('../../constants/instagram');

const mock = new MockAdapter(axios);

describe('getUserId', () => {
  const mockUsername = 'testuser';
  const mockCookie = 'csrftoken=abc123; sessionid=xyz789; ds_user_id=12345';
  const mockUserId = '12345';

  beforeEach(() => {
    mock.reset();
  });

  it('should fetch user ID correctly', async () => {
    const mockUserData = {
      data: {
        user: {
          id: mockUserId,
          username: mockUsername
        }
      }
    };

    mock.onGet(`${ENDPOINTS.USER_INFO}?username=${mockUsername}`)
      .reply(200, mockUserData);

    const headers = {
      'X-CSRFToken': 'abc123',
      'Cookie': mockCookie
    };

    const userId = await getUserId(mockUsername, headers);
    expect(userId).toBe(mockUserId);
  });

  it('should throw error when user data is not available', async () => {
    mock.onGet(`${ENDPOINTS.USER_INFO}?username=${mockUsername}`)
      .reply(200, { data: {} });

    const headers = {
      'X-CSRFToken': 'abc123',
      'Cookie': mockCookie
    };

    await expect(getUserId(mockUsername, headers))
      .rejects.toThrow('Failed to fetch user information');
  });
});