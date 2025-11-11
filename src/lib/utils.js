export const formateMessageTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return ''; // check for invalid date
  
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

