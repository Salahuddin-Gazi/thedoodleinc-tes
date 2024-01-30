// Function to save data to localStorage with a timestamp
export function saveUser(userId) {
  const data = {
    userId,
    timestamp: new Date().getTime(),
  };
  localStorage.setItem("userId", JSON.stringify(data));
}

// Function to retrieve data from localStorage and check expiry
export function getUser() {
  const storedData = localStorage.getItem("userId");

  if (storedData) {
    const data = JSON.parse(storedData);
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - data.timestamp;

    // Check if data is still valid (less than 72 hours old)
    if (timeDifference < 72 * 60 * 60 * 1000) {
      return data.userId;
    } else {
      // Clear the data if it has expired
      localStorage.removeItem(key);
      return null;
    }
  } else {
    return null;
  }
}

export function removeUser() {
  const storedData = localStorage.getItem("userId");

  if (storedData) {
    localStorage.removeItem("userId");
  }
}
