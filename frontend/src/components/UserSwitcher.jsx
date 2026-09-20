import { getCurrentUser, setCurrentUser } from "../auth/currentUser.js";

function UserSwitcher() {
  const currentUser = getCurrentUser();

  function switchToUser1() {
    setCurrentUser({
      id: "user-1",
      name: "Housni",
    });

    window.location.reload();
  }

  function switchToUser2() {
    setCurrentUser({
      id: "user-2",
      name: "Ahmad",
    });

    window.location.reload();
  }

  function switchToUser3() {
    setCurrentUser({
      id: "user-3",
      name: "Omar",
    });

    window.location.reload();
  }

  return (
    <div>
      <button
        onClick={switchToUser1}
        style={{
          color: currentUser.id === "user-1" ? "blue" : "black",
        }}
      >
        User 1 - Housni
      </button>

      <button
        onClick={switchToUser2}
        style={{
          color: currentUser.id === "user-2" ? "blue" : "black",
        }}
      >
        User 2 - Ahmad
      </button>

      <button
        onClick={switchToUser3}
        style={{
          color: currentUser.id === "user-3" ? "blue" : "black",
        }}
      >
        User 3 - Omar
      </button>
    </div>
  );
}

export default UserSwitcher;
