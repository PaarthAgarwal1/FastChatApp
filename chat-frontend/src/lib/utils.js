export function formatMessageTime(date) {
    const messageDate = new Date(date);
    const now = new Date();
    const diffInMinutes = Math.floor((now - messageDate) / 60000); 
    if (diffInMinutes < 10) {
      return diffInMinutes === 0 ? "Just now" : `${diffInMinutes} min ago`;
    }
  
    return messageDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  