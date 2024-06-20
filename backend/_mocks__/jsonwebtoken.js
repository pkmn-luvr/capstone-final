const jwt = jest.requireActual('jsonwebtoken');

export const sign = jest.fn().mockReturnValue('mocked_token');
export const verify = jest.fn((token, secret, callback) => {
  if (token === 'mocked_token') {
    callback(null, { username: 'testuser', isadmin: false });
  } else {
    callback(new Error('Invalid token'), null);
  }
});

export default { sign, verify };
