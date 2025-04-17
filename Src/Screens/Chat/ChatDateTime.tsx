export function formatMessageTimestamp(timestamp: string): string {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) throw new Error("Invalid date");
  
      // Force UTC+5:30 (330 minutes ahead of UTC)
      const offsetMinutes = -330; // UTC+5:30
      const localDate = new Date(date.getTime() + (offsetMinutes * 60 * 1000));
      const now = new Date();
      const localNow = new Date(now.getTime() + (offsetMinutes * 60 * 1000));
  
      // Check if it's today in local time
      const isToday =
        localDate.getDate() === localNow.getDate() &&
        localDate.getMonth() === localNow.getMonth() &&
        localDate.getFullYear() === localNow.getFullYear();
  
      // Check if it's yesterday in local time
      const yesterday = new Date(localNow);
      yesterday.setDate(localNow.getDate() - 1);
      const isYesterday =
        localDate.getDate() === yesterday.getDate() &&
        localDate.getMonth() === yesterday.getMonth() &&
        localDate.getFullYear() === yesterday.getFullYear();
  
      // Format time in local timezone
      let hours = localDate.getHours();
      const minutes = localDate.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12 || 12; // Convert 0 to 12 for midnight
      const time = `${hours}:${minutes} ${ampm}`;
  
      // Format date
      if (isToday) {
        return `${time}`;
      } else if (isYesterday) {
        return `Yesterday, ${time}`;
      } else {
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const month = months[localDate.getMonth()];
        const day = localDate.getDate();
        return `${month} ${day}, ${time}`;
      }
    } catch {
      return "Invalid date";
    }
  }



  export function formatTimeDifference(dateString: string | number | Date) {
    if (!dateString) return 'Long time ago';
  
    const currentDate = new Date();
    const targetDate = new Date(dateString);
  
    const diffInSeconds = Math.floor((currentDate - targetDate) / 1000); // Difference in seconds
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);
  
    // Handle "today", "yesterday", etc.
    if (diffInSeconds < 60) {
      return `Just now`;
    }
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
  
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
  
    if (diffInDays === 1) {
      return `Yesterday, ${formatTime(targetDate)}`;
    }
  
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  
    if (diffInWeeks < 5) {
      return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    }
  
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    }
  
    if (diffInYears > 0) {
      return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
    }
  
    return 'Long time ago'; // Default fallback
  }
  
  // Helper function to format time (hour and minute) based on the user's timezone
  function formatTime(date: number | Date | undefined) {
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
  
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }