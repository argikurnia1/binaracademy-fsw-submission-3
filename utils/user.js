const fs = require("fs");

const getAllUserData = (file, options) => {
  return JSON.parse(fs.readFileSync(file, options));
};

const validatorUpdate = (req, res, next) => {
  const userId = req.params.id;
  const { username, email } = req.body;
  const userData = getAllUserData("user.json", "utf-8");

  const findUpdateUserById = userData.find((user) => {
    return user.id === userId;
  });

  if (!username && email) {
    req.body.username = findUpdateUserById.username;
  }

  if (!email && username) {
    req.body.email = findUpdateUserById.email;
  }

  next();
};

module.exports = {
  getAllUserData,
  validatorUpdate,
};
