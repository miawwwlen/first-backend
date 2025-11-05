import { UserService } from './user-service.js';

const userService = new UserService();

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({ users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  async updateUserProfile(req, res) {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const data = req.body;
      const updatedUser = await userService.updateUserProfile(userId, data);
      res
        .status(200)
        .json({ message: 'User profile updated', user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Failed to update user profile' });
    }
  }
}

export default new UserController();
