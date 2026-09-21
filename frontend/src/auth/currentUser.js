const CURRENT_USER_KEY = "currentUser";

function getCurrentUser() {
  const savedUser = sessionStorage.getItem(
    CURRENT_USER_KEY,
  );

  if (!savedUser) {
    return null;
  }

  return JSON.parse(savedUser);
}

function setCurrentUser(user) {
  sessionStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify(user),
  );
}

function clearCurrentUser() {
  sessionStorage.removeItem(
    CURRENT_USER_KEY,
  );
}

export {
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
};