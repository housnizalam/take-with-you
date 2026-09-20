const DEFAULT_USER = {
  id: "user-1",
  name: "Housni",
};

function getCurrentUser() {
  const savedUser = sessionStorage.getItem("currentUser");

  if (!savedUser) {
    return DEFAULT_USER;
  }

  return JSON.parse(savedUser);
}

function setCurrentUser(user) {
  sessionStorage.setItem(
    "currentUser",
    JSON.stringify(user),
  );
}

export {
  getCurrentUser,
  setCurrentUser,
};