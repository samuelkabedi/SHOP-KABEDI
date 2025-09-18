const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const userController = require("../../controllers/userController");

jest.mock("../../models/User");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("crypto");
jest.mock("nodemailer");

describe("User Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { _id: "userId" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
    process.env.JWT_SECRET = "testsecret"; // Set the JWT secret for testing
  });

  describe("loginUser", () => {
    it("should login a user", async () => {
      req.body = { email: "john@example.com", password: "123456" };
      User.findOne.mockResolvedValue({
        _id: "userId",
        name: "John",
        email: "john@example.com",
        password: "hashedPassword",
        isAdmin: false,
        toObject: jest.fn().mockReturnValue({
          _id: "userId",
          name: "John",
          email: "john@example.com",
          isAdmin: false,
        }),
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token");

      await userController.loginUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
      expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashedPassword");
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          _id: "userId",
          name: "John",
          email: "john@example.com",
          isAdmin: false,
        },
        "testsecret",
        { expiresIn: "1h" }
      );
      expect(res.send).toHaveBeenCalledWith({
        _id: "userId",
        name: "John",
        email: "john@example.com",
        isAdmin: false,
        token: "token",
      });
    });

    it("should return 401 if email or password is incorrect", async () => {
      req.body = { email: "john@example.com", password: "123456" };
      User.findOne.mockResolvedValue(null);

      await userController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("Invalid email or password");
    });
  });
