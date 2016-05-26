Notifications.allow({
  update(userId) {
    if (userId) return true;
    return false;
  }
});