const jwt = require('jsonwebtoken');

class JWTService {
  constructor() {
    this.secret = process.env.JWT_SECRET || 'default-secret-change-in-production';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }
  
  generateToken(payload) {
    return jwt.sign(payload, this.secret, { 
      expiresIn: this.expiresIn,
      algorithm: 'HS256'
    });
  }
  
  verifyToken(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      return null;
    }
  }
  
  decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }
  
  generateRefreshToken(userId) {
    return jwt.sign(
      { userId, type: 'refresh' },
      this.secret,
      { expiresIn: '30d' }
    );
  }
}

module.exports = new JWTService();
