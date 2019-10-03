import jsonwebtoken from 'jsonwebtoken';

/**
 * @class TokenUtil
 * Handle JWT Token Management
 */
class TokenUtil {
  /**
   * Sign payload and returns JWT
   * @param {Object} payload
   * @param {String} time - Expiry time
   */
  static sign(payload, time = '10d') {
    return jsonwebtoken.sign(payload, process.env.JWT_SECRET, { expiresIn: time });
  }

  /**
   * Verifies JWT and returns Payload
   * @param {String} token - JWT
   */
  static verify(token) {
    return jsonwebtoken.verify(token, process.env.JWT_SECRET);
  }
}

export default TokenUtil;
